import { Component, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { TranslationService } from 'app/services/translationService';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppRoutes } from 'app/AppRoutes';
import { PermissionWithNavigation } from 'app/permissionConstants';
import { AuthUSerService } from 'app/services/authUserService';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { UtilitiesService } from 'app/services/utilitiesService';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PaidStatus } from '../contract/contract.component';

@Component({
    selector: 'main',
    templateUrl: './main.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class MainComponent {
    permissionWithNavigation: PermissionWithNavigation;
    newNavigation: FuseNavigationItem[];
    /**
     * Constructor
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private fuseNavigationService: FuseNavigationService,
        private translationService: TranslationService,
        private translatedService: TranslateService,
        private authUserService: AuthUSerService,
        private _fuseNavigationService: FuseNavigationService,
        private utilitiesService: UtilitiesService,
        private router:Router
    ) {
        this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe((urlObject: NavigationEnd) => {
            if (urlObject.url) {
                if (!urlObject.url.includes(AppRoutes.Contract)) {
                    localStorage.setItem('isPaid',`${PaidStatus.Unpaid}` );
                }
            } else {
                localStorage.setItem('isPaid', `${PaidStatus.Unpaid}`);
            }
        });
    }
    async ngOnInit(): Promise<void> {}
    gotoLogin() {}
}
