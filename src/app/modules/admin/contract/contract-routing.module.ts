import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateContractComponent } from 'app/modules/components/create-contract/create-contract.component';
import { ViewContractComponent } from 'app/modules/components/view-contract/view-contract.component';

import { ContractComponent } from './contract.component';

const routes: Routes = [
    {
        path: '',
        component: ContractComponent,
    },
    {
        path: 'view/:id',
        component: ViewContractComponent,
    },
    {
        path: 'edit/:id',
        component: CreateContractComponent,
    },
    {
        path: 'create',
        component: CreateContractComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ContractRoutingModule {}
