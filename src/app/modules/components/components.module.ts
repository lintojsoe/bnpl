import { NgModule } from '@angular/core';
import { CommonAddButtonComponent } from './common-add-button/common-add-button.component';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ViewCustomerComponent } from './view-customer/view-customer.component';
import { CreateMerchantComponent } from './create-merchant/create-merchant.component';
import { ViewTransactionsComponent } from './view-transactions/view-transactions.component';
import { TransferComponent } from './transfer/transfer.component';
import { ViewContractComponent } from './view-contract/view-contract.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { CreateContractComponent } from './create-contract/create-contract.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { SendReminderComponent } from './send-reminder/send-reminder.component';
import { SharedModule } from 'app/shared/shared.module';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { EmptyItemsComponent } from './empty-items/empty-items.component';
import { BankDashboardComponent } from './bank-dashboard/bank-dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MerchantDashboardComponent } from './merchant-dashboard/merchant-dashboard.component';
import { DocumentsComponent } from './documents/documents.component';
import { CreateMerchantUserComponent} from './create-merchant-user/create-merchant-user.component';
import { CreateBankUserComponent } from './create-bank-user/create-bank-user.component';
import { ViewMerchantsComponent } from './view-merchants/view-merchants.component';
import { ContractReportsComponent } from './reports/contract-reports/contract-reports.component';
import { PayoutReportsComponent } from './reports/payout-reports/payout-reports.component';
import { DownloadButtonComponent } from './download-button/download-button.component';
import { DownloadListComponent } from './download-list/download-list.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ContractPaymentReportComponent } from './reports/contract-payment-report/contract-payment-report.component';
import { CreateRolesComponent } from './create-roles/create-roles.component';
import { ChangeUserPasswordComponent } from './change-user-password/change-user-password.component';
import { ChangeAdminPasswordComponent } from './change-admin-password/change-admin-password.component';
import { ValidateInputs } from 'app/inputValidation';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AddBankNamesComponent } from './add-bank-names/add-bank-names.component';
import { AddBusinessCategoryComponent } from './add-business-category/add-business-category.component';
import { ProductReportComponent } from './merchant-reports/product-report/product-report.component';
import { SalesReportComponent } from './merchant-reports/sales-report/sales-report.component';

@NgModule({
    declarations: [
        CommonAddButtonComponent,
        CreateCustomerComponent,
        ViewCustomerComponent,
        CreateMerchantComponent,
        ViewTransactionsComponent,
        TransferComponent,
        ViewContractComponent,
        BreadcrumbComponent,
        CreateContractComponent,
        CreateUserComponent,
        SendReminderComponent,
        AlertModalComponent,
        EmptyItemsComponent,
        BankDashboardComponent,
        MerchantDashboardComponent,
        DocumentsComponent,
        CreateMerchantUserComponent,
        CreateBankUserComponent,
        ViewMerchantsComponent,
        ContractReportsComponent,
        PayoutReportsComponent,
        DownloadButtonComponent,
        DownloadListComponent,
        ContractPaymentReportComponent,
        CreateRolesComponent,
        ChangeUserPasswordComponent,
        ChangeAdminPasswordComponent,
        AddBankNamesComponent,
        AddBusinessCategoryComponent,
        ProductReportComponent,
        SalesReportComponent,
    ],
    exports: [
        CommonAddButtonComponent,
        CreateCustomerComponent,
        BankDashboardComponent,
        TransferComponent,
        BreadcrumbComponent,
        SendReminderComponent,
        EmptyItemsComponent,
        MerchantDashboardComponent,
        DocumentsComponent,
        CreateMerchantUserComponent,
        CreateBankUserComponent,
        PayoutReportsComponent,
        ContractReportsComponent,
        DownloadButtonComponent,
        ChangeUserPasswordComponent
        
    ],
    imports: [
        SharedModule,
        NgxChartsModule,
        NgApexchartsModule,
        NgxSkeletonLoaderModule,
        MatProgressSpinnerModule
    ],
    providers: [MatDatepickerModule,ValidateInputs],
})
export class ComponentsModule {}
