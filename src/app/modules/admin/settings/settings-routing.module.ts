import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankNameComponent } from 'app/modules/admin/settings/bank-name/bank-name.component';
import { BusinessCategoryComponent } from 'app/modules/admin/settings/business-category/business-category.component';

import { SettingsComponent } from './settings.component';

export const routes: Routes = [
    {
        path: '',
        component: SettingsComponent,
        children: [
            {
                path: 'bank-name',
                component: BankNameComponent,
            },
            {
                path: 'business-category',
                component: BusinessCategoryComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingsRoutingModule {}
