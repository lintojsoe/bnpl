import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCustomerComponent } from 'app/modules/components/create-customer/create-customer.component';
import { ViewCustomerComponent } from 'app/modules/components/view-customer/view-customer.component';

import { CustomersComponent } from './customers.component';

const routes: Routes = [
    {
        path: '',
        component: CustomersComponent,
    },
    {
        path: 'create',
        component: CreateCustomerComponent,
        pathMatch: 'full',
    },
    {
        path: 'edit/:id',
        component: CreateCustomerComponent,
    },
    {
        path: 'view/:id',
        component: ViewCustomerComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CustomersRoutingModule {}
