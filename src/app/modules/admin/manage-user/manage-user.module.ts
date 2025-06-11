import { NgModule } from '@angular/core';

import { ManageUserRoutingModule } from './manage-user-routing.module';
import { ManageUserComponent } from './manage-user.component';
import { ComponentsModule } from 'app/modules/components/components.module';
import { SharedModule } from 'app/shared/shared.module';
import { BankUserComponent } from '../bank-user/bank-user.component';
import { MerchantUserComponent } from '../merchant-user/merchant-user.component';

@NgModule({
    declarations: [
        ManageUserComponent,
        BankUserComponent,
        MerchantUserComponent,
    ],
    imports: [SharedModule, ManageUserRoutingModule, ComponentsModule],
    exports: [BankUserComponent, MerchantUserComponent],
})
export class ManageUserModule {}
