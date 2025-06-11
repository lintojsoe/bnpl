import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AppRoutes } from 'app/AppRoutes';
import { MainComponent } from 'app/modules/admin/main/main.component';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'app/modules/components/components.module';

const exampleRoutes: Route[] = [
    {
        path: '',
        component: MainComponent,
        children: [
            {
                path: 'dashboard',
                redirectTo: AppRoutes.Dashboard,
                pathMatch: 'full',
            },
            {
                path: AppRoutes.Dashboard,
                // canActivate: [GuradService],
                loadChildren: () =>
                    import('../dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
            },
            {
                path: AppRoutes.Contract,
                // canActivate: [GuradService],
                loadChildren: () =>
                    import('../contract/contract.module').then(
                        (m) => m.ContractModule
                    ),
            },
            {
                path: AppRoutes.ManageUser,
                // canActivate: [GuradService],
                loadChildren: () =>
                    import('../manage-user/manage-user.module').then(
                        (m) => m.ManageUserModule
                    ),
            },
            {
                path: AppRoutes.Customers,
                // canActivate: [GuradService],
                loadChildren: () =>
                    import('../customers/customers.module').then(
                        (m) => m.CustomersModule
                    ),
            },
            {
                path: AppRoutes.Invoice,
                // canActivate: [GuradService],
                loadChildren: () =>
                    import('../invoice/invoice.module').then(
                        (m) => m.InvoiceModule
                    ),
            },
            {
                path: AppRoutes.Merchants,
                // canActivate: [GuradService],
                loadChildren: () =>
                    import('../outlets/outlets.module').then(
                        (m) => m.OutletsModule
                    ),
            },
            {
                path: AppRoutes.Roles,
                // canActivate: [GuradService],
                loadChildren: () =>
                    import('../roles-management/roles-management.module').then(
                        (m) => m.RolesManagementModule
                    ),
            },
            {
                path: AppRoutes.Reports,
                // canActivate: [GuradService],
                loadChildren: () =>
                    import('../reports/reports.module').then(
                        (m) => m.ReportsModule
                    ),
            },
            {
                path: AppRoutes.MerchantReports,
                // canActivate: [GuradService],
                loadChildren: () =>
                    import('../merchant-reports/merchant-reports.module').then(
                        (m) => m.MerchantReportsModule
                    ),
            },
            {
                path: AppRoutes.PayoutReports,
                // canActivate: [GuradService],
                loadChildren: () =>
                    import('../payout-reports/payout.reports.module').then(
                        (m) => m.PayoutReportModule
                    ),
            },
            {
                path: AppRoutes.Settings,
                loadChildren: () =>
                    import('../settings/settings.module').then(
                        (m) => m.SettingsModule
                    ),
            },
            {
                path: AppRoutes.TransferReport,
                // canActivate: [GuradService],
                loadChildren: () =>
                    import('../transfer-reports/transfer-reports.module').then(
                        (m) => m.TransferReportModule
                    ),
            },
            {
                path: AppRoutes.ChangePassword,
                loadChildren: () =>
                    import(
                        '../auth/change-password/change-password.module'
                    ).then((m) => m.ChangePasswordModule),
            },
        ],
    },
];

@NgModule({
    declarations: [MainComponent],
    imports: [
        RouterModule.forChild(exampleRoutes),
        TranslateModule,
        ComponentsModule,
    ],
})
export class MainModule {}
