import { NgModule } from '@angular/core';

import { RolesManagementRoutingModule } from './roles-management-routing.module';
import { RolesManagementComponent } from './roles-management.component';
import { ComponentsModule } from 'app/modules/components/components.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [RolesManagementComponent],
    imports: [RolesManagementRoutingModule, SharedModule, ComponentsModule],
    exports: [],
})
export class RolesManagementModule {}
