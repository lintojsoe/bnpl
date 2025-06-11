import { NgModule } from '@angular/core';
import { ComponentsModule } from 'app/modules/components/components.module';
import { SharedModule } from 'app/shared/shared.module';
import { MerchantReportsRoutingModule } from './merchant-reports-routing.module';
import { MerchantReportsComponent } from './merchant-reports.component';

@NgModule({
    declarations: [MerchantReportsComponent],
    imports: [MerchantReportsRoutingModule, SharedModule, ComponentsModule],
    exports: [],
})
export class MerchantReportsModule {}
