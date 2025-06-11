import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PayoutReportsComponent } from "./payout-reports.component";

const routes: Routes = [
    {
        path: "",
        component: PayoutReportsComponent,
        
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PayoutReportRoutingModule {}
