import { NgModule } from '@angular/core';
import { ContractRoutingModule } from './contract-routing.module';
import { ContractComponent } from './contract.component';
import { ComponentsModule } from 'app/modules/components/components.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [ContractComponent],
    imports: [ContractRoutingModule, SharedModule, ComponentsModule],
    exports: [],
})
export class ContractModule {}
