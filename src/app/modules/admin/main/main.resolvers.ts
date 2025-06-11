import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { TranslateService } from '@ngx-translate/core';
import { AppRoutes } from 'app/AppRoutes';
import { PermissionWithNavigation } from 'app/permissionConstants';
import { AuthUSerService, UtilitiesService } from 'app/services';

@Injectable({
    providedIn: 'root',
})
export class MainNavigationResolver implements Resolve<any> {
    permissionWithNavigation: PermissionWithNavigation;
    constructor(
        private utilitiesService: UtilitiesService,
        private translatedService: TranslateService,
        private authUserService: AuthUSerService
    ) {}

    async resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<any> {
        this.permissionWithNavigation = new PermissionWithNavigation();
        const navigation: FuseNavigationItem[] = [
            {
                id: 'dashboard',
                title: this.translatedService.instant('Dashboard'),
                type: 'basic',
                icon: 'mat_outline:dashboard',
                link: AppRoutes.Dashboard,
            },
            {
                id: 'contract',
                title: this.translatedService.instant('Contract'),
                type: 'basic',
                icon: 'mat_outline:event_note',
                link: AppRoutes.Contract,
            },
            {
                id: 'manageUsers',
                title: this.translatedService.instant('Manage Users'),
                type: 'basic',
                icon: 'mat_outline:people',
                link: AppRoutes.ManageUser,
            },
            {
                id: 'customers',
                title: this.translatedService.instant('Customers'),
                type: 'basic',
                icon: 'mat_outline:people',
                link: AppRoutes.Customers,
            },
            {
                id: 'merchants',
                title: this.translatedService.instant('Merchants'),
                type: 'basic',
                icon: 'mat_outline:home_work',
                link: AppRoutes.Merchants,
            },
            {
                id: 'payout_reports',
                title: this.translatedService.instant('Transaction Reports'),
                type: 'basic',
                icon: 'mat_outline:insert_drive_file',
                link: AppRoutes.PayoutReports,
            },
            {
                id: 'reports',
                title: this.translatedService.instant('Reports'),
                type: 'basic',
                icon: 'mat_outline:library_books',
                link: AppRoutes.Reports,
            },
            {
                id: 'merchant_reports',
                title: this.translatedService.instant('Reports'),
                type: 'basic',
                icon: 'mat_outline:library_books',
                link: AppRoutes.MerchantReports,
            },
            {
                id: 'role_permissions',
                title: this.translatedService.instant('Roles & Permissions'),
                type: 'basic',
                icon: 'mat_outline:security',
                link: AppRoutes.Roles,
            },
            {
                id: 'settings',
                title: this.translatedService.instant('Settings'),
                type: 'basic',
                icon: 'mat_outline:settings',
                link: AppRoutes.Settings,
            },
        ];
        let isBank = await this.utilitiesService.isBank();
        this.permissionWithNavigation.navItems.forEach(async (navID) => {
            if (navID == 'payout_reports' && isBank) {
                navigation
                    .filter((data) => data.id == navID)
                    .map((item) => (item.hidden = () => true));
            }
            if (navID == 'reports') {
                if (await this.utilitiesService.isBank()) {
                    let count = 0;
                    let reportObject =
                        this.permissionWithNavigation.multiplePermission[navID];
                    for (var key in reportObject) {
                        let permissionCode = reportObject[key];
                        if (permissionCode) {
                            let showOrHidden =
                                this.authUserService.checkPermission(
                                    permissionCode
                                );
                            if (showOrHidden) {
                                count = count + 1;
                            }
                        }
                    }
                    if (count == 0) {
                        navigation
                            .filter((data) => data.id == navID)
                            .map((item) => (item.hidden = () => true));
                    }
                } else {
                    navigation
                        .filter((data) => data.id == navID)
                        .map((item) => (item.hidden = () => true));
                }
            } else if (
                typeof this.permissionWithNavigation.permissionDetails[navID] ==
                'string'
            ) {
                let permissionCode =
                    this.permissionWithNavigation.permissionDetails[navID];
                if (permissionCode) {
                    let showOrHidden =
                        this.authUserService.checkPermission(permissionCode);
                    if (!showOrHidden) {
                        navigation
                            .filter((data) => data.id == navID)
                            .map((item) => (item.hidden = () => true));
                    }
                }
            } else {
                let count = 0;
                let reportObject: any =
                    this.permissionWithNavigation.multiplePermission[navID];
                for (var key in reportObject) {
                    let permissionCode = reportObject[key];
                    if (permissionCode) {
                        let showOrHidden =
                            this.authUserService.checkPermission(
                                permissionCode
                            );
                        if (showOrHidden) {
                            count = count + 1;
                        }
                    }
                }
                if (count == 0) {
                    navigation
                        .filter((data) => data.id == navID)
                        .map((item) => (item.hidden = () => true));
                }
            }
        });

        return {
            navigation: {
                compact: navigation,
                default: navigation,
                futuristic: navigation,
                horizontal: navigation,
            },
        };
    }
}
