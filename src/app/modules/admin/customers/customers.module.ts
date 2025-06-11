import { NgModule } from '@angular/core';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { ComponentsModule } from 'app/modules/components/components.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [CustomersComponent],
    imports: [SharedModule, CustomersRoutingModule, ComponentsModule],
    exports: [],
})
export class CustomersModule {}
