import { Component, isDevMode } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config';
import { TranslateService } from '@ngx-translate/core';
import { locale as english } from 'assets/i18n/en';
import { locale as arabic } from 'assets/i18n/ar';
import { TranslationService } from './services/translationService';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AuthService } from './core/auth/auth.service';
import { Router } from '@angular/router';
import { AuthUSerService } from './services/authUserService';
import { RolesService } from './services/roles/roles.service';

export interface Locale {
    lang: string;
    data: Object;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    /**
     * Constructor
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _translateService: TranslateService,
        private translationService: TranslationService,
        private fuseSplashScreenService: FuseSplashScreenService,
        private matPaginatorIntl: MatPaginatorIntl,
        private router: Router,
        private authUserService: AuthUSerService,
        private _authService: AuthService,
        private rolesService: RolesService
    ) {
        let language = localStorage.getItem('language')
            ? localStorage.getItem('language')
            : 'en';
        if (this.authUserService.isTokenIsValid()) {
            this._translateService.addLangs(['en', 'ar']);
            this._translateService.setDefaultLang(language);
            this.loadTranslations(english, arabic);
            this.matPaginatorIntl.previousPageLabel =
                this._translateService.instant('Previous page');
            this.matPaginatorIntl.nextPageLabel =
                this._translateService.instant('Next page');
            this.matPaginatorIntl.lastPageLabel =
                this._translateService.instant('Last page');
            this.matPaginatorIntl.firstPageLabel =
                this._translateService.instant('First page');
            this.matPaginatorIntl.itemsPerPageLabel =
                this._translateService.instant('Items per page :');

            setTimeout(() => {
                //this is only the temporary fix
                this.translationService.useLanguage(language);
            }, 500);
        } else {
            this._authService.signOut();
            this.router.navigate(['sign-in']);
        }
    }

    loadTranslations(...args: Locale[]): void {
        const locales = [...args];

        locales.forEach((locale) => {
            this._translateService.setTranslation(
                locale.lang,
                locale.data,
                true
            );
        });
    }
    ngOnInit(): void {
        if (!isDevMode()) {
            console.log = function () { }
        }
        if (this._authService.accessToken) {
            this.refreshPermission();
        }
    }
    refreshPermission() {
        this.rolesService.refreshPermission().subscribe((data) => {
            let resp: any = data;
            this.authUserService.setPermission(resp.permissions);
        });
    }
}
