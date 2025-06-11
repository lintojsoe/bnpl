import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateContractComponent } from 'app/modules/components/create-contract/create-contract.component';
import { ViewContractComponent } from 'app/modules/components/view-contract/view-contract.component';

import { ChangePasswordComponent } from './change-password.component';

const routes: Routes = [
    {
        path: '',
        component: ChangePasswordComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChangePasswordRoutingModule {}
