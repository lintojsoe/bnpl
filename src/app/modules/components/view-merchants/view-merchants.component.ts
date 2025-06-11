import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { AppRoutes } from 'app/AppRoutes';
import { AuthUSerService } from 'app/services/authUserService';
import { OutletsService } from 'app/services/outlets/outlets.service';
import { TranslationService } from 'app/services/translationService';
import { UtilitiesService } from 'app/services/utilitiesService';

@Component({
    selector: 'app-view-merchants',
    templateUrl: './view-merchants.component.html',
    styleUrls: ['./view-merchants.component.scss'],
    animations: FuseAnimations,
})
export class ViewMerchantsComponent implements OnInit {
    id: any = '';
    breadcrumbs = [];
    merchantsDetails: any = '';
    files = [];
    constructor(
        private router: Router,
        public utilitiesService: UtilitiesService,
        public translationService: TranslationService,
        private _location: Location,
        private activatedRoute: ActivatedRoute,
        private outletsService: OutletsService,
        public authUserService: AuthUSerService,
    ) {
        this.activatedRoute.params.subscribe((data) => {
            console.log(data['id']);
            this.id = data['id'];
        });
        this.setBreadcrumbs();
    }

    async ngOnInit(): Promise<void> {
        if (this.id) {
            await this.getMerchantsDetails();
        }
    }
    async getMerchantsDetails() {
        try {
            this.utilitiesService.startLoader();
            const merchantsDetails = await this.outletsService
                .getMerchantsDetails(this.id)
                .toPromise();
            if (merchantsDetails) {
                this.merchantsDetails = merchantsDetails;
                if (this.merchantsDetails.documents.length) {
                    this.merchantsDetails.documents.forEach((data) => {
                        this.files.push({
                            document: data.document,
                        });
                    });
                }
                this.utilitiesService.stopLoader();
            }
        } catch {
        } finally {
        }
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
                name_en: 'View',
                name_ar: 'منظر',
            },
        ];
    }
    edit() {
        this.router.navigate([`${AppRoutes.Merchants}/edit/${this.id}`]);
    }
    goBack() {
        this._location.back();
    }
    viewContracts() {
        this.router.navigate([`${AppRoutes.Contract}`], {
            queryParams: {
                merchant: this.id,
            },
        });
    }
    viewAttchment(url) {
        if (url) {
            window.open(url, '_blank');
        }
    }
}
