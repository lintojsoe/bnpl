import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateMerchantComponent } from 'app/modules/components/create-merchant/create-merchant.component';
import { ViewMerchantsComponent } from 'app/modules/components/view-merchants/view-merchants.component';
import { ViewTransactionsComponent } from 'app/modules/components/view-transactions/view-transactions.component';

import { OutletsComponent } from './outlets.component';

const routes: Routes = [
    {
        path: '',
        component: OutletsComponent,
    },
    {
        path: 'create',
        component: CreateMerchantComponent,
        pathMatch: 'full',
    },
    {
        path: 'view/:id',
        component: ViewMerchantsComponent,
    },
    {
        path: 'edit/:id',
        component: CreateMerchantComponent,
    },
    {
        path: 'view-payouts/:id',
        component: ViewTransactionsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OutletsRoutingModule {}
