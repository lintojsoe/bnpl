import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { TranslateService } from '@ngx-translate/core';
import { AppRoutes } from 'app/AppRoutes';
import { AuthUSerService } from 'app/services/authUserService';
import { TranslationService } from 'app/services/translationService';
import { UtilitiesService } from 'app/services/utilitiesService';
import { Crumb } from '../customers/customer.types';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    animations: FuseAnimations,
})
export class ReportsComponent implements OnInit {
    reports = [];
    report: any = '';
    breadcrumbs: Crumb[] = [];
    isOpenReports: boolean = false;

    constructor(
        public translateService: TranslateService,
        private utilitiesService: UtilitiesService,
        private router: Router,
        private authUserService:AuthUSerService
    ) {}
    setBreadcrumbs() {
        this.breadcrumbs = [
            {
                absolute: true,
                disabled: true,
                path: `${AppRoutes.Reports}`,
                relative: false,
                name_en: 'Reports',
                name_ar: 'التقارير',
            },
        ];
    }
    ngOnInit(): void {
        this.setBreadcrumbs();
        this.reports = [
            {
                id: 1,
                name: this.translateService.instant('Contract Report'),
                url: 'contract-reports',
                key: this.utilitiesService.Permission.StaffContractList,
                imgage:""
            },
            {
                id: 2,
                name: this.translateService.instant('Transaction Report'),
                url: 'payout-bank-reports',
                key:this.utilitiesService.Permission.PayoutList
            },
            {
                id: 3,
                name: this.translateService.instant('Contract Payment Report'),
                url: 'contract-payment',
                key:this.utilitiesService.Permission.ContractPaymentList
            },
        ];
    }

    getPermission(key) {
       return this.authUserService.checkPermission(key) 
    }

    openReport(report) {
        console.log(report)
        this.router.navigate([`${AppRoutes.Reports}/${report.url}`]);
    }
}
