import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'app/shared/shared.module';
import { ComponentsModule } from 'app/modules/components/components.module';

@NgModule({
    declarations: [DashboardComponent],
    imports: [SharedModule, DashboardRoutingModule, ComponentsModule],
    exports: [],
})
export class DashboardModule {}
