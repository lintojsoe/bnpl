import { NgModule } from '@angular/core';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { ComponentsModule } from 'app/modules/components/components.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [ReportsComponent],
    imports: [ReportsRoutingModule, SharedModule, ComponentsModule],
    exports: [],
})
export class ReportsModule {}
