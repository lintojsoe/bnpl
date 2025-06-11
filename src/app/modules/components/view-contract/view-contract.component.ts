import { Component, OnInit } from '@angular/core';
import { FuseAnimations } from '@fuse/animations';
import { AppRoutes } from 'app/AppRoutes';
import { Crumb, Pagination } from 'app/modules/admin/customers/customer.types';
import { TranslationService } from 'app/services/translationService';
import { UtilitiesService } from 'app/services/utilitiesService';
import { Location } from '@angular/common';
import { ContractService } from 'app/services/contract/contract.service';
import { ActivatedRoute } from '@angular/router';
import {
    ContractStatus,
    ContractStatuses,
    PaymentStatuses,
} from 'app/contractStatus';
import { SharedService } from 'app/services';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-view-contract',
    templateUrl: './view-contract.component.html',
    styleUrls: ['./view-contract.component.scss'],
    animations: FuseAnimations,
})
export class ViewContractComponent implements OnInit {
    id: any = '';
    contractItems: any[] = [];
    breadcrumbs: Crumb[] = [];
    pagination: Pagination;
    productsCount: number = 0;
    productsTableColumns: string[] = [
        'product_name',
        'description',
        'quantity',
        'unit_price',
        'total',
    ];
    files = [];
    paymentTableColumns: string[] = [
        'amount',
        'due_date',
        'payment_status_id',
        'payment_number',
    ];
    contractDetails: any;
    paymentPlan = [];
    paymentEnum = new PaymentStatuses();
    contractEnum = ContractStatus;
    isBank: boolean = false;
    constructor(
        public utilitiesService: UtilitiesService,
        public translationService: TranslationService,
        private _location: Location,
        private contractService: ContractService,
        private activatedRoute: ActivatedRoute,
        private sharedService:SharedService
    ) {
        this.activatedRoute.params.subscribe((data) => {
            console.log(data['id']);
            this.id = data['id'];
        });
    }

    async ngOnInit(): Promise<void> {
        this.isBank = await this.utilitiesService.isBank();
        this.setBreadcrumbs();
        if (this.id) {
            await this.getContractDetails();
        }
    }
    printPDF() {
        let url = `${environment.server_url}${this.sharedService.contracts}${this.id}/pdf`
        window.open(url,"_self")
    }
    async getContractDetails() {
        try {
            this.utilitiesService.startLoader();
            let contractDetails = await this.contractService
                .getContractDetail(this.id)
                .toPromise();
            if (contractDetails) {
                this.contractDetails = contractDetails;
                contractDetails.items.forEach((data) => {
                    this.contractItems.push({
                        product_name: data.product_name,
                        quantity: data.quantity,
                        unit_price: data.unit_price,
                        description: data.description,
                        price: data.price,
                    });
                });
                this.contractItems = [...this.contractItems];
                contractDetails.contract_payments.forEach((data) => {
                    this.paymentPlan.push({
                        amount: data.amount,
                        due_date: data.due_date,
                        payment_status_id: data.payment_status_id,
                        payment_number: data.payment_number,
                    });
                });
                this.paymentPlan = [...this.paymentPlan];
                this.files = contractDetails.contract_documents;
                this.files = [...this.files];
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
                path: `${AppRoutes.Contract}`,
                relative: false,
                name_en: 'Contract',
                name_ar: 'اتفافية',
            },
            {
                absolute: true,
                disabled: true,
                path: ``,
                relative: false,
                name_en: 'View',
                name_ar: 'منظر',
            },
        ];
    }
    goBack() {
        this._location.back();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    viewAttchment(url) {
        window.open(url, '_blank');
    }

    getStatusColor() {
        let borderClass = '';
        if (this.contractDetails) {
            if (
                this.contractDetails.contract_status.id ==
                this.contractEnum.Pending
            ) {
                borderClass = 'border-yellow-300';
            }
            if (
                this.contractDetails.contract_status.id ==
                this.contractEnum.Approved
            ) {
                borderClass = 'border-green-500';
            }
            if (
                this.contractDetails.contract_status.id ==
                this.contractEnum.Rejected
            ) {
                borderClass = 'border-red-600';
            }
            if (
                this.contractDetails.contract_status.id ==
                this.contractEnum.Settled
            ) {
                if (this.isBank) {
                    borderClass = 'border-indigo-600';
                } else {
                    borderClass = 'border-green-500';
                }
            }
        }
        return borderClass;
    }
    getPaymentStatus(paymentID?) {
        if (paymentID) {
            let paymentName = this.paymentEnum.PaymentStatuses.filter(
                (data) => data.id == paymentID
            ).map((item) => item.name);
            return paymentName;
        } else {
            return '---';
        }
    }
    
}
