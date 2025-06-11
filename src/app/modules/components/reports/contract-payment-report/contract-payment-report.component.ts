import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FuseAnimations } from '@fuse/animations';
import { AppRoutes } from 'app/AppRoutes';
import { PaymentStatuses } from 'app/contractStatus';
import { DownloadTypes } from 'app/downloadTypes';
import { Crumb } from 'app/modules/admin/customers/customer.types';
import { TranslationService } from 'app/services';
import { AuthUSerService } from 'app/services/authUserService';
import { ContractService } from 'app/services/contract/contract.service';
import { UtilitiesService } from 'app/services/utilitiesService';
import { debounceTime } from 'rxjs/operators';
import { DownloadListComponent } from '../../download-list/download-list.component';
import { Location } from '@angular/common';

@Component({
    selector: 'app-contract-payment-report',
    templateUrl: './contract-payment-report.component.html',
    styleUrls: ['./contract-payment-report.component.scss'],
    animations: FuseAnimations,
})
export class ContractPaymentReportComponent implements OnInit {
    productsCount: number = 0;
    productsTableColumns: string[] = [
        'customer_name',
        'contract_id',
        // 'payment_number',
        'payment_status',
        'account',
        'amount',
        'due_date',
        'paid_date',
        'contract_date',
    ];
    contractsPayment = [];
    breadcrumbs: Crumb[] = [];
    form: FormGroup;
    paymentEnum = new PaymentStatuses();
    page = {
        length: 0,
        pageSize: 10,
        pageIndex: 0,
        pageSizeOptions: [10, 25, 100],
    };
    offset = 0;
    constructor(
        private fb: FormBuilder,
        public utilitiesService: UtilitiesService,
        private contractService: ContractService,
        private dialog: MatDialog,
        public authUserService: AuthUSerService,
        public translationService: TranslationService,
        private _location: Location
    ) {}

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    goBack() {
        this._location.back();
    }

    async ngOnInit(): Promise<void> {
        this.form = this.fb.group({
            customer_name: [''],
            reference: [''],
            payment_number: [''],
            payment_status: [''],
        });
        this.setBreadcrumbs();
        await this.getContractsPayments();
        this.form.valueChanges.pipe(debounceTime(500)).subscribe((data) => {
            this.getContractsPayments();
        });
    }
    async getContractsPayments(
        limit = this.page.pageSize,
        offset = this.offset,
        form = this.form.controls
    ) {
        try {
            this.utilitiesService.startLoader();
            let contracts = await this.contractService
                .getContractsPayments(limit, offset, '', form)
                .toPromise();
            if (contracts) {
                this.page.length = contracts.count;
                this.contractsPayment = contracts.results;
                this.contractsPayment = [...this.contractsPayment];
                this.utilitiesService.stopLoader();
            } else {
                this.utilitiesService.stopLoader();
            }
        } catch {
            this.utilitiesService.stopLoader();
        } finally {
        }
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
                name_en: 'Contract Payments',
                name_ar: 'مدفوعات العقد',
            },
        ];
    }
    handlePageEvent(event) {
        this.page.length = event.length;
        this.page.pageSize = event.pageSize;
        this.page.pageIndex = event.pageIndex;
        this.offset = this.page.pageIndex * this.page.pageSize;
        this.getContractsPayments();
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
            data: { type: DownloadTypes.ContractPayment },
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
            .getContractsPayments(9999999, 0, '', this.form.controls, true)
            .toPromise();
    }
}
