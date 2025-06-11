import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateRolesComponent } from 'app/modules/components/create-roles/create-roles.component';
import { RolesManagementComponent } from './roles-management.component';

const routes: Routes = [
    {
        path: '',
        component: RolesManagementComponent,
    },
    {
        path: 'create',
        component: CreateRolesComponent,
        pathMatch: 'full',
    },
    {
        path: 'edit/:id',
        component: CreateRolesComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RolesManagementRoutingModule {}
