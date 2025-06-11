import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { TranslateService } from '@ngx-translate/core';
import { AppRoutes } from 'app/AppRoutes';
import { ContractStatus, ContractStatuses } from 'app/contractStatus';
import { SendReminderComponent } from 'app/modules/components/send-reminder/send-reminder.component';
import { Pagination } from 'app/pagination';
import { AuthUSerService } from 'app/services/authUserService';
import { ContractService } from 'app/services/contract/contract.service';
import { CustomerService } from 'app/services/customer/customer.service';
import { TranslationService } from 'app/services/translationService';
import { UtilitiesService } from 'app/services/utilitiesService';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ContractTypes, Crumb } from '../customers/customer.types';

export enum PaidStatus {
    Paid = 1,
    Unpaid = 2,
    All = 3,
}

@Component({
    selector: 'app-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.scss'],
    animations: FuseAnimations,
})
export class ContractComponent implements OnInit {
    contracts: ContractTypes[] = [];
    breadcrumbs: Crumb[] = [];
    page = new Pagination().page;
    PaidStatus = PaidStatus;
    productsCount: number = 0;
    productsTableColumns: string[] = [
        'customer_name',
        'contact_no',
        'contract_no',
        'account',
        'contract_date',
        'amount',
        'contract_status',
        'action',
    ];
    form: FormGroup;

    contractEnum = new ContractStatuses();
    contractStatus = ContractStatus;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    searchKey: string;
    customerID: any = '';
    merchantID: any = '';
    type: any = '';
    isBank = false;
    isPaid: number = PaidStatus.Unpaid;
    constructor(
        private route: Router,
        public translationService: TranslationService,
        public utilitiesService: UtilitiesService,
        private dialog: MatDialog,
        private contractService: ContractService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        public authUSerService: AuthUSerService,
        private translateService: TranslateService,
        private customerService: CustomerService
    ) {
        this.activatedRoute.queryParams.subscribe((data) => {
            if (data.customer) {
                this.isPaid = PaidStatus.All;
                this.customerID = data.customer;
            } else if (data.merchant) {
                this.isPaid = PaidStatus.All;
                this.merchantID = data.merchant;
            } else if (data.type) {
                this.isPaid = PaidStatus.All;
                this.type = data.type;
            }
        });
    }



    toggleStatus(value) {
        localStorage.setItem('isPaid', value);
        this.isPaid = value;
        this.route.navigate([]);
        this.type = 0;
        this.setStatus();
    }

    getDisplayedColumns() {
        let columns = this.productsTableColumns
        if (this.isPaid != PaidStatus.All) {
            columns = this.productsTableColumns.filter(
                (cd) => cd != 'contract_status'
            );
        } else {
            columns = this.productsTableColumns;
        }

        if (!this.isBank) {
            return columns.filter(data => data != "account")
        } else {
            return columns
        }
    }

    setStatus() {
        if (this.type === 0 || !this.type) {
            this.form.controls.contract_status.setValue('');
        } else {
            this.form.controls.contract_status.setValue(+this.type);
        }
    }


    async ngOnInit(): Promise<void> {
        if (!this.type) {
            this.isPaid = localStorage.getItem('isPaid')
                ? +localStorage.getItem('isPaid')
                : this.isPaid;
        }

        this.isBank = await this.utilitiesService.isBank();
        this.form = this.fb.group({
            name: [''],
            reference: [''],
            contract_status: [''],
            contact_no: [''],
        });
        this.setBreadcrumbs();
        this.setStatus();
        await this.getContracts();
        this.form.valueChanges.pipe(debounceTime(500)).subscribe((data) => {
            this.page = new Pagination().page;
            this.getContracts();
        });
    }

    async getContracts(
        limit = this.page.pageSize,
        offset = this.page.offset,
        form = this.form.controls
    ) {
        try {
            this.utilitiesService.startLoader();
            let isPaid = false;
            let isAddShow = false;
            if (this.isPaid == PaidStatus.Paid) {
                isAddShow = true;
                isPaid = true;
            } else if (this.isPaid == PaidStatus.Unpaid) {
                isAddShow = true;
                isPaid = false;
            } else {
                isAddShow = false;
            }
            let contracts = await this.contractService
                .getContracts(
                    limit,
                    offset,
                    this.searchKey,
                    form,
                    this.customerID,
                    this.merchantID,
                    !this.isBank ? isAddShow : false,
                    '',
                    isPaid
                )
                .toPromise();
            if (contracts) {
                this.page.length = contracts.count;
                this.contracts = contracts.results;
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
        this.getContracts();
    }

    setBreadcrumbs() {
        this.breadcrumbs = [
            {
                absolute: true,
                disabled: true,
                path: `${AppRoutes.Contract}`,
                relative: false,
                name_en: 'Contract',
                name_ar: 'اتفافية',
            },
        ];
    }

    ngAfterViewInit(): void { }
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    edit(id) {
        this.route.navigate([`${AppRoutes.Contract}/edit/${id}`]);
    }
    view(id) {
        this.route.navigate([`${AppRoutes.Contract}/view/${id}`]);
    }
    add() {
        this.route.navigate([`${AppRoutes.Contract}/create/`]);
    }
    async sendNotification(id) {
        let isMobile = this.utilitiesService.isMobile();
        let size = {
            width: '50vw',
            height: '70vh',
        };
        if (isMobile) {
            size.height = '100%';
            size.width = '100%';
        }
        const dialogRef = this.dialog.open(SendReminderComponent, {
            data: {},
            maxWidth: '',
            width: `${size.width}`,
            height: `${size.height}`,
        });

        dialogRef.afterClosed().subscribe(async (resp) => {
            if (resp) {
                try {
                    resp.customer_id = id;
                    this.utilitiesService.startLoader();
                    let successmsg = this.translateService.instant(
                        'Notification send successfully'
                    );
                    const notification = await this.customerService
                        .sendReminder(resp)
                        .toPromise();
                    if (notification) {
                        this.utilitiesService.stopLoader();
                        this.utilitiesService.showSuccessToast(successmsg);
                    }
                } catch {
                } finally {
                }
            }
        });
    }
}
