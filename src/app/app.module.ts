import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ContractService } from './services/contract/contract.service';
import { SharedService } from './services/sharedService';
import { CustomerService } from './services/customer/customer.service';
import { ManageUserService } from './services/manage-user/manage-user.service';
import { OutletsService } from './services/outlets/outlets.service';
import { DashboardService } from './services/dashboard/dashboard.service';
import { AuthUSerService } from './services/authUserService';
import { JwtModule } from "@auth0/angular-jwt";
import { DownalodService } from './services/download.service';
import { RolesService } from './services/roles/roles.service';
import { ErrorComponent } from './error/error/error.component';
import { AdditionalService } from './services/additionalService';
import { SettingsService } from './services/settings/settings.service';

export function tokenGetter() {
    return localStorage.getItem("access_token");
}
const routerConfig: ExtraOptions = {
    scrollPositionRestoration: 'enabled',
    preloadingStrategy: PreloadAllModules,
    relativeLinkResolution: 'legacy',
};

@NgModule({
    declarations: [AppComponent, ErrorComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse & Fuse Mock API
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),
        TranslateModule.forRoot(),
        NgxUiLoaderModule,

        // Core
        CoreModule,

        // Layout
        LayoutModule,
        MatSnackBarModule,
        MatDialogModule,
        // 3rd party modules
        MarkdownModule.forRoot({}),
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
            },
        }),
    ],
    bootstrap: [AppComponent],
    providers: [
        AuthUSerService,
        ContractService,
        SharedService,
        CustomerService,
        ManageUserService,
        OutletsService,
        DashboardService,
        DownalodService,
        RolesService,
        AdditionalService,
        SettingsService
    ],
})
export class AppModule {}
