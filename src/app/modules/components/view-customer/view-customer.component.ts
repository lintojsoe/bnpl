import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { AppRoutes } from 'app/AppRoutes';
import { Crumb, Pagination } from 'app/modules/admin/customers/customer.types';
import { TranslationService } from 'app/services/translationService';
import { UtilitiesService } from 'app/services/utilitiesService';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { CustomerService } from 'app/services/customer/customer.service';
import { AuthUSerService } from 'app/services/authUserService';

@Component({
    selector: 'app-view-customer',
    templateUrl: './view-customer.component.html',
    styleUrls: ['./view-customer.component.scss'],
    animations: FuseAnimations,
})
export class ViewCustomerComponent implements OnInit {
    breadcrumbs: Crumb[] = [];
    id: any = '';
    files = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    customerDetails: any;
    constructor(
        private router: Router,
        public utilitiesService: UtilitiesService,
        public translationService: TranslationService,
        private _location: Location,
        private activatedRoute: ActivatedRoute,
        private customerService: CustomerService,
        public authUserService:AuthUSerService
    ) {
        this.activatedRoute.params.subscribe((data) => {
            console.log(data['id']);
            this.id = data['id'];
        });
        this.setBreadcrumbs();
    }

    async ngOnInit(): Promise<void> {
        if (this.id) {
            await this.getCustomerDetails();
        }
    }
    async getCustomerDetails() {
        try {
            this.utilitiesService.startLoader();
            let customerDetails = await this.customerService
                .getCustomerDetails(this.id)
                .toPromise();
            if (customerDetails) {
                this.customerDetails = customerDetails;
                this.files = this.customerDetails.documents;
                this.files = [...this.files];
                this.utilitiesService.stopLoader();
            } else {
                this.utilitiesService.stopLoader;
            }
        } catch {
            this.utilitiesService.stopLoader;
        } finally {
        }
    }
    setBreadcrumbs() {
        this.breadcrumbs = [
            {
                absolute: true,
                disabled: false,
                path: `${AppRoutes.Customers}`,
                relative: false,
                name_en: 'Customers',
                name_ar: 'عملاء',
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

    edit() {
        this.router.navigate([`${AppRoutes.Customers}/edit/${this.id}`]);
    }
    goBack() {
        this._location.back();
    }
    viewContracts() {
        this.router.navigate([`${AppRoutes.Contract}`], {
            queryParams: {
                customer: this.id,
            },
        });
    }
    viewAttchment(url) {
        window.open(url, '_blank');
    }
}
