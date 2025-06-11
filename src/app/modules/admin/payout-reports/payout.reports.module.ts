import { NgModule } from '@angular/core';

import { PayoutReportRoutingModule } from './payout.reports-routing.module';
import { PayoutReportsComponent } from './payout-reports.component';
import { ComponentsModule } from 'app/modules/components/components.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [PayoutReportsComponent],
    imports: [PayoutReportRoutingModule, SharedModule, ComponentsModule],
    exports: [],
})
export class PayoutReportModule {}
