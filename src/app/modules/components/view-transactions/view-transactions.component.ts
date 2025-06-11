import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { AppRoutes } from 'app/AppRoutes';
import { Location } from '@angular/common';
import {
    ContractTypes,
    Crumb,
    Pagination,
} from 'app/modules/admin/customers/customer.types';
import { UtilitiesService } from 'app/services/utilitiesService';
import { Subject } from 'rxjs';
import { TranslationService } from 'app/services/translationService';
import { ContractService } from 'app/services/contract/contract.service';
import { OutletsService } from 'app/services/outlets/outlets.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ContractStatuses } from 'app/contractStatus';

@Component({
    selector: 'app-view-transactions',
    templateUrl: './view-transactions.component.html',
    styleUrls: ['./view-transactions.component.scss'],
    animations: FuseAnimations,
})
export class ViewTransactionsComponent implements OnInit {
    id: any = '';
    isPaid: boolean = false;
    isTransfer: boolean = false;
    contracts: ContractTypes[] = [];
    breadcrumbs: Crumb[] = [];
    selection = new SelectionModel<ContractTypes>(true, []);
    totalAmount: number = 0;
    page = {
        length: 0,
        pageSize: 10,
        pageIndex: 0,
        pageSizeOptions: [10, 25, 100],
    };
    offset: number = 0;
    productsCount: number = 0;
    searchKey: any = '';
    productsTableColumns = [
        'contract_no',
        'transaction_date',
        'create_date',
        'amount',
        // 'contract_status',
        'action',
    ];

    contractEnum = new ContractStatuses();

    merchantDetails: any = '';
    merchantInfo: any;
    contractIDs = [];
    form: FormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private utilitiesService: UtilitiesService,
        private _location: Location,
        public translationService: TranslationService,
        private contractService: ContractService,
        private outletService: OutletsService,
        private fb: FormBuilder
    ) {
        this.activatedRoute.params.subscribe((data) => {
            this.id = data['id'];
            console.log(this.id);
        });
        this.activatedRoute.queryParams.subscribe((data) => {
            let state = data['state'];
            console.log(state);
            this.isPaid = state ? true : false;
            if (state) {
                this.getPayouts();
            }
        });
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [''],
            reference: [''],
            contract_status: [''],
        });
        if (this.id) {
            this.getMerchantDetails();
            this.getPayouts();
        }
        this.setBreadcrumbs();
        this.form.valueChanges.pipe(debounceTime(500)).subscribe((data) => {
            this.getPayouts();
        });
    }

    async getPayouts(
        limit = this.page.pageSize,
        offset = this.offset,
        form = this.form.controls
    ) {
        try {
            debugger;
            this.utilitiesService.startLoader();
            let reports = await this.contractService
                .getPayoutReports(
                    limit,
                    offset,
                    this.searchKey,
                    form,
                    false,
                    this.id,
                    this.isPaid
                )
                .toPromise();

            if (reports) {
                console.log(reports);
                this.page.length = reports.count;
                this.contracts = reports.results;
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
        this.getPayouts();
    }

    setBreadcrumbs() {
        this.breadcrumbs = [
            {
                absolute: true,
                disabled: false,
                path: `${AppRoutes.Merchants}`,
                relative: false,
                name_en: 'Merchants',
                name_ar: 'التجار',
            },
            {
                absolute: true,
                disabled: true,
                path: ``,
                relative: false,
                name_en: 'View Transaction',
                name_ar: 'عرض الصفقة',
            },
        ];
    }

    async getMerchantDetails() {
        try {
            const merchantDetails = await this.outletService
                .getMerchantsDetails(this.id)
                .toPromise();
            if (merchantDetails) {
                this.merchantInfo = merchantDetails;
            }
        } catch {
        } finally {
        }
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

    edit(id) {}
    view(id) {
        this.router.navigate([`${AppRoutes.Contract}/view/${id}`]);
    }

    viewPayouts(id) {
        let payoutReportsDetail = this.contracts.filter(
            (data) => data.id == id
        );
        if (payoutReportsDetail.length) {
            this.merchantDetails = payoutReportsDetail[0];
        }
        this.isTransfer = true;
    }

    toggleStatus(status) {
        this.contractIDs = [];
        this.totalAmount = 0;
        this.isPaid = status;
        this.selection.clear();
        this.getPayouts();
    }

    getColumns() {
        let tempColumn = this.productsTableColumns;
        if (this.isPaid) {
            tempColumn = [...tempColumn.filter((data) => data != 'action')];
        } else {
            tempColumn = [
                ...tempColumn.filter((data) => data != 'transaction_date'),
            ];
        }
        return tempColumn;
    }

    selectRow(event, row) {
        if (!this.isPaid) {
            if (!this.selection.isSelected(row)) {
                this.contractIDs.push(row.id);
                this.totalAmount += parseFloat(row.total);
            } else {
                this.contractIDs = this.contractIDs.filter(
                    (id) => id != row.id
                );
                this.totalAmount -= parseFloat(row.total);
            }
            console.log(this.contractIDs);
            this.selection.toggle(row);
        }

        console.log(this.selection.selected);
    }
    selectAll() {
        this.totalAmount = 0;
        this.selection.clear();
        this.contracts.forEach((row) => {
            this.contractIDs.push(row.id);
            this.totalAmount += parseFloat(row.total);
            this.selection.toggle(row);
        });
    }

    unSelect() {
        this.contractIDs = [];
        this.totalAmount = 0;
        this.selection.clear();
    }

    transfer() {
        this.isTransfer = true;
    }
    goBack() {
        this._location.back();
    }
    toggleTransfer(value) {
        this.isTransfer = false;
        if (!value) {
            this.isPaid = false;
        } else {
            this.isPaid = true;
        }
        this.getPayouts();
    }
}
