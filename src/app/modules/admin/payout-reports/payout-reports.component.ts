import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { AppRoutes } from 'app/AppRoutes';
import { DownloadTypes } from 'app/downloadTypes';
import { DownloadListComponent } from 'app/modules/components/download-list/download-list.component';
import { Pagination } from 'app/pagination';
import { AuthUSerService } from 'app/services/authUserService';
import { ContractService } from 'app/services/contract/contract.service';
import { UtilitiesService } from 'app/services/utilitiesService';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Crumb, TransferReports } from '../customers/customer.types';

@Component({
    selector: 'app-payout-reports',
    templateUrl: './payout-reports.component.html',
    styleUrls: ['./payout-reports.component.scss'],
    animations: FuseAnimations,
})
export class PayoutReportsComponent implements OnInit {
    reports: TransferReports[] = [];
    breadcrumbs: Crumb[] = [];
    page = new Pagination().page;
    productsCount: number = 0;
    productsTableColumns: string[] = [
        'transaction_id',
        'bank_name',
        'iban_number',
        'account_name',
        'amount',
        'transaction_date',
        'attachments',
    ];
    searchKey: any = '';
    form: FormGroup;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private route: Router,
        private contractService: ContractService,
        public utilitiesService: UtilitiesService,
        private fb: FormBuilder,
        private dialog: MatDialog,
        public authUserService: AuthUSerService
    ) {}

    async ngOnInit(): Promise<void> {
        this.form = this.fb.group({
            iban_no: [''],
            account_name: [''],
            bank_name: [''],
            reference: [''],
        });
        await this.setBreadcrumbs();
        await this.getPayoutReports();
        this.form.valueChanges.pipe(debounceTime(500)).subscribe((data) => {
            this.page = new Pagination().page;
            this.getPayoutReports();
        });
    }

    async getPayoutReports(
        limit = this.page.pageSize,
        offset = this.page.offset,
        form = this.form.controls
    ) {
        try {
            this.utilitiesService.startLoader();
            let reports = await this.contractService
                .getPayoutReports(
                    limit,
                    offset,
                    this.searchKey,
                    form,
                    false,
                    '',
                    true
                )
                .toPromise();
            console.log(reports);
            if (reports) {
                this.page.length = reports.count;
                this.reports = reports.results;
                this.utilitiesService.stopLoader();
            } else {
                this.utilitiesService.stopLoader();
            }
        } catch {
            this.utilitiesService.stopLoader();
        } finally {
        }
    }

    handlePageEvent(event) {
        this.page.length = event.length;
        this.page.pageSize = event.pageSize;
        this.page.pageIndex = event.pageIndex;
        this.page.offset = this.page.pageIndex * this.page.pageSize;
        this.getPayoutReports();
    }
    async setBreadcrumbs() {
        this.breadcrumbs = [
            {
                absolute: true,
                disabled: false,
                path: `${AppRoutes.PayoutReports}`,
                relative: false,
                name_en: 'Transaction Reports',
                name_ar: 'التجار',
            },
        ];
    }

    ngAfterViewInit(): void {}

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    viewAttchment(url) {
        window.open(url, '_blank');
    }
    openDownloads() {
        let isMobile = this.utilitiesService.isMobile();
        let size = {
            width: '30%',
            height: '100%',
        };
        if (isMobile) {
            size.height = '100%';
            size.width = '100%';
        }
        const dialogRef = this.dialog.open(DownloadListComponent, {
            data: { type: DownloadTypes.PayoutReport },
            position: { right: '0%', left: '70%' },
            maxWidth: '',
            width: size.width,
            height: size.height,
            panelClass: [!isMobile ? 'mat-dialog-height-transition' : ''],
        });
        dialogRef.afterClosed().subscribe(async (resp) => {
            if (resp) {
            }
        });
    }
    async download() {
        const download = await this.contractService
            .getPayoutReports(
                9999999,
                0,
                this.searchKey,
                this.form.controls,
                true,
                '',
                true
            )
            .toPromise();
    }
}
