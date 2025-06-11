import { Component, OnInit } from '@angular/core';
import { AppRoutes } from 'app/AppRoutes';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { SendReminderComponent } from 'app/modules/components/send-reminder/send-reminder.component';
import { ContractService } from 'app/services/contract/contract.service';
import { TranslationService } from 'app/services/translationService';
import { UtilitiesService } from 'app/services/utilitiesService';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
    ContractTypes,
    Crumb,
} from 'app/modules/admin/customers/customer.types';
import { DownloadListComponent } from '../../download-list/download-list.component';
import { DownloadTypes } from 'app/downloadTypes';
import { AuthUSerService } from 'app/services/authUserService';
import { ContractStatuses } from 'app/contractStatus';
import { Location } from '@angular/common';

@Component({
    selector: 'app-contract-reports',
    templateUrl: './contract-reports.component.html',
    styleUrls: ['./contract-reports.component.scss'],
    animations: FuseAnimations,
})
export class ContractReportsComponent implements OnInit {
    contracts: ContractTypes[] = [];
    breadcrumbs: Crumb[] = [];
    page = {
        length: 0,
        pageSize: 10,
        pageIndex: 0,
        pageSizeOptions: [10, 25, 100],
    };
    offset: number = 0;

    productsCount: number = 0;
    productsTableColumns: string[] = [
        'customer_name',
        'contact_no',
        'contract_no',
        'contract_date',
        'amount',
        'contract_status',
    ];

    contractEnum = new ContractStatuses();
    form: FormGroup;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    searchKey: string;
    customerID: any = '';
    merchantID: any = '';

    constructor(
        private route: Router,
        public translationService: TranslationService,
        public utilitiesService: UtilitiesService,
        private dialog: MatDialog,
        private contractService: ContractService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        public authUserService: AuthUSerService,
        private _location: Location
    ) {
        this.activatedRoute.queryParams.subscribe((data) => {
            debugger;
            if (data.customer) {
                this.customerID = data.customer;
            } else if (data.merchant) {
                this.merchantID = data.merchant;
            }
        });
    }

    async ngOnInit(): Promise<void> {
        this.form = this.fb.group({
            name: [''],
            reference: [''],
            contract_status: [''],
            contact_no: [''],
        });
        this.setBreadcrumbs();
        await this.getContracts();
        this.form.valueChanges.pipe(debounceTime(500)).subscribe((data) => {
            this.getContracts();
        });
    }

    async getContracts(
        limit = this.page.pageSize,
        offset = this.offset,
        form = this.form.controls
    ) {
        try {
            this.utilitiesService.startLoader();
            let contracts = await this.contractService
                .getContractsMerchants(
                    limit,
                    offset,
                    this.searchKey,
                    form,
                    this.customerID,
                    this.merchantID
                )
                .toPromise();
            if (contracts) {
                this.page.length = contracts.count;
                this.contracts = contracts.results;
                this.contracts = [...this.contracts];
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
        this.offset = this.page.pageIndex * this.page.pageSize;
        this.getContracts();
    }

    ngAfterViewInit(): void {}
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    setBreadcrumbs() {
        this.breadcrumbs = [
            {
                absolute: true,
                disabled: false,
                path: `${AppRoutes.Reports}`,
                relative: false,
                name_en: 'Reports',
                name_ar: 'التقارير',
            },
            {
                absolute: true,
                disabled: true,
                path: ``,
                relative: false,
                name_en: 'Contract Report',
                name_ar: 'تقرير العقد',
            },
        ];
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
            data: { type: DownloadTypes.StaffContract },
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
            .getContractsMerchants(
                9999999,
                0,
                this.searchKey,
                this.form.controls,
                this.customerID,
                this.merchantID,
                false,
                '',
                false,
                true
            )
            .toPromise();
    }
    goBack() {
        this._location.back();
    }
}
