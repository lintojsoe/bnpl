import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductReportComponent } from 'app/modules/components/merchant-reports/product-report/product-report.component';
import { SalesReportComponent } from 'app/modules/components/merchant-reports/sales-report/sales-report.component';

import { MerchantReportsComponent } from './merchant-reports.component';

const routes: Routes = [
    {
        path: '',
        component: MerchantReportsComponent,
    },
    {
        path: 'sales-report',
        component: SalesReportComponent,
    },
    {
        path: "product-report",
        component:ProductReportComponent
    },
    // {
    //     path: "contract-payment",
    //     component:ContractPaymentReportComponent
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MerchantReportsRoutingModule {}
