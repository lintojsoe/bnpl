import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { TranslateService } from '@ngx-translate/core';
import { AppRoutes } from 'app/AppRoutes';
import { AuthUSerService, UtilitiesService } from 'app/services';
import { Crumb } from '../customers/customer.types';

@Component({
    selector: 'app-merchant-reports',
    templateUrl: './merchant-reports.component.html',
    styleUrls: ['./merchant-reports.component.scss'],
    animations: FuseAnimations,
})
export class MerchantReportsComponent implements OnInit {
    reports = [];
    report: any = '';
    breadcrumbs: Crumb[] = [];
    isOpenReports: boolean = false;

    constructor(
        public translateService: TranslateService,
        private utilitiesService: UtilitiesService,
        private router: Router,
        private authUserService: AuthUSerService
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
                name: this.translateService.instant('Sales Report'),
                url: 'sales-report',
                key: this.utilitiesService.Permission.SalesList,
            },
            {
                id: 2,
                name: this.translateService.instant('Product Report'),
                url: 'product-report',
                key: this.utilitiesService.Permission.ProductReport,
            },
        ];
    }

    getPermission(key) {
        return this.authUserService.checkPermission(key);
    }

    openReport(report) {
        console.log(report);
        this.router.navigate([`${AppRoutes.MerchantReports}/${report.url}`]);
    }
}
