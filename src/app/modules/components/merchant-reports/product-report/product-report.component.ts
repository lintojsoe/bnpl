import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { AppRoutes } from 'app/AppRoutes';
import { ContractStatuses } from 'app/contractStatus';
import { DownloadTypes } from 'app/downloadTypes';
import { Crumb } from 'app/modules/admin/customers/customer.types';
import { Pagination } from 'app/pagination';
import {
    AuthUSerService,
    ContractService,
    TranslationService,
    UtilitiesService,
} from 'app/services';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DownloadListComponent } from '../../download-list/download-list.component';

@Component({
    selector: 'app-product-report',
    templateUrl: './product-report.component.html',
    styleUrls: ['./product-report.component.scss'],
    animations: FuseAnimations,
})
export class ProductReportComponent implements OnInit {
    contracts = [];
    breadcrumbs: Crumb[] = [];
    page = new Pagination().page;
    offset: number = 0;

    productsCount: number = 0;
    productsTableColumns: string[] = [
        'contract_reference',
        'product_name',
        'quantity',
        'unit_price',
        'total',
    ];

    contractEnum = new ContractStatuses();
    form: FormGroup;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    searchKey: string;

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
        this.page = new Pagination().page;
    }
    goBack() {
        this._location.back();
    }
    async ngOnInit(): Promise<void> {
        this.form = this.fb.group({
            product_name: [''],
            contract_reference: [''],
        });
        this.setBreadcrumbs();
        await this.getProductReport();
        this.form.valueChanges.pipe(debounceTime(500)).subscribe((data) => {
            this.page = new Pagination().page;
            this.getProductReport();
        });
    }

    async getProductReport(
        limit = this.page.pageSize,
        offset = this.offset,
        form = this.form.controls
    ) {
        try {
            this.utilitiesService.startLoader();
            let contracts = await this.contractService
                .getProductReport(limit, offset, this.searchKey, form)
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
        this.getProductReport();
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
                path: `${AppRoutes.MerchantReports}`,
                relative: false,
                name_en: 'Reports',
                name_ar: 'التقارير',
            },
            {
                absolute: true,
                disabled: true,
                path: ``,
                relative: false,
                name_en: 'Product Report',
                name_ar: 'تقرير المنتج ',
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
            data: { type: DownloadTypes.ProductReport },
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
            .getProductReport(
                9999999,
                0,
                this.searchKey,
                this.form.controls,
                true
            )
            .toPromise();
    }
}
