import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppRoutes } from 'app/AppRoutes';
import { TranslationService } from 'app/services/translationService';
import { UtilitiesService } from 'app/services/utilitiesService';
import { Crumb } from '../customers/customer.types';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { Subject } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { takeUntil } from 'rxjs/operators';
import { AuthUSerService } from 'app/services/authUserService';
import { TranslateService } from '@ngx-translate/core';
import { SettingsNavEnum } from 'app/permissionConstants';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    drawerOpened: boolean;
    menuData: FuseNavigationItem[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    childMenu = [];

    constructor(
        private route: Router,
        public translationService: TranslationService,
        private fb: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        public authUserService: AuthUSerService,
        public utilitiesService: UtilitiesService,
        private translateService: TranslateService
    ) {
        this.utilitiesService.startLoader();
        this.menuData = [
            {
                id: SettingsNavEnum.GeneralSettings,
                title: 'General Settings',
                type: 'group',
                children: [
                    {
                        id: SettingsNavEnum.BankName,
                        title: this.translateService.instant('Bank Name'),
                        type: 'basic',
                        link: AppRoutes.BankName,
                        hidden: () => false,
                    },
                    {
                        id: SettingsNavEnum.BusinessCategory,
                        title: this.translateService.instant(
                            'Business Category'
                        ),
                        type: 'basic',
                        link: AppRoutes.BusinessCategory,
                        hidden: () => false,
                    },
                ],
            },
        ];

        this.menuData.forEach((items) => {
            items.children.forEach((data) => {
                if (data.id == SettingsNavEnum.BankName) {
                    let hidden = this.authUserService.checkPermission(
                        this.utilitiesService.Permission.BankNameList
                    );
                    if (!hidden) {
                        data.hidden = () => true;
                    } else {
                        data.hidden = () => false;
                    }
                }
                if (data.id == SettingsNavEnum.BusinessCategory) {
                    let hidden = this.authUserService.checkPermission(
                        this.utilitiesService.Permission.CategoryList
                    );
                    if (!hidden) {
                        data.hidden = () => true;
                    } else {
                        data.hidden = () => false;
                    }
                }
                this.childMenu.push(data);
            });
        });
    }

    async redirectTo() {
        console.log(this.childMenu[0].hidden())
        for (let i = 0; i < this.childMenu.length; i++) {
            debugger
            if (!this.childMenu[i].hidden()) {
                if (this.childMenu[i].id == SettingsNavEnum.BankName) {
                    this.route.navigate([
                        `${AppRoutes.Settings}/${AppRoutes.BankName}`,
                    ]);
                    break;
                } else if (
                    this.childMenu[i].id == SettingsNavEnum.BusinessCategory
                ) {
                    this.route.navigate([
                        `${AppRoutes.Settings}/${AppRoutes.BusinessCategory}`,
                    ]);
                    break;
                }
            }
        }
    }

    async ngOnInit(): Promise<void> {
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(async ({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('md')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                } else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        await this.redirectTo();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
