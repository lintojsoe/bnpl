import { NgModule } from '@angular/core';

import { OutletsRoutingModule } from './outlets-routing.module';
import { OutletsComponent } from './outlets.component';
import { ComponentsModule } from 'app/modules/components/components.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [OutletsComponent],
    imports: [OutletsRoutingModule, SharedModule, ComponentsModule],
    exports: [],
})
export class OutletsModule {}
