import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContractPaymentReportComponent } from 'app/modules/components/reports/contract-payment-report/contract-payment-report.component';
import { ContractReportsComponent } from 'app/modules/components/reports/contract-reports/contract-reports.component';
import { PayoutReportsComponent } from 'app/modules/components/reports/payout-reports/payout-reports.component';

import { ReportsComponent } from './reports.component';

const routes: Routes = [
    {
        path: '',
        component: ReportsComponent,
    },
    {
        path: 'contract-reports',
        component: ContractReportsComponent,
    },
    {
        path: "payout-bank-reports",
        component:PayoutReportsComponent
    },
    {
        path: "contract-payment",
        component:ContractPaymentReportComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReportsRoutingModule {}
