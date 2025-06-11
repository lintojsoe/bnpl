import { NgModule } from '@angular/core';

import { TransferReportRoutingModule } from './transfer-reports-routing.module';
import { TransferReportsComponent } from './transfer-reports.component';
import { ComponentsModule } from 'app/modules/components/components.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [TransferReportsComponent],
    imports: [TransferReportRoutingModule, SharedModule, ComponentsModule],
    exports: [],
})
export class TransferReportModule {}
