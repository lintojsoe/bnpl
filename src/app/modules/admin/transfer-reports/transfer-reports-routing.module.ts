import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { TransferReportsComponent } from "./transfer-reports.component";

const routes: Routes = [
    {
        path: "",
        component: TransferReportsComponent,
        
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TransferReportRoutingModule {}
