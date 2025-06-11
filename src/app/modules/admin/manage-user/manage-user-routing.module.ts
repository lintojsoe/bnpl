import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCustomerComponent } from 'app/modules/components/create-customer/create-customer.component';
import { CreateUserComponent } from 'app/modules/components/create-user/create-user.component';
import { ViewCustomerComponent } from 'app/modules/components/view-customer/view-customer.component';

import { ManageUserComponent } from './manage-user.component';

const routes: Routes = [
    {
        path: '',
        component: ManageUserComponent,
    },
    {
        path: 'create',
        component: CreateUserComponent,
        pathMatch: 'full',
    },
    {
        path: 'edit/:id',
        component: CreateUserComponent,
    },
    // {
    //     path: 'view/:id',
    //     component: ViewCustomerComponent,
    // },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ManageUserRoutingModule {}
