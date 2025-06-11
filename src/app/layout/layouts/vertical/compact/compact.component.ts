import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import {
    FuseNavigationItem,
    FuseNavigationService,
} from '@fuse/components/navigation';
import { InitialData } from 'app/app.types';
import { TranslationService } from 'app/services/translationService';
import { AppRoutes } from 'app/AppRoutes';

@Component({
    selector: 'compact-layout',
    templateUrl: './compact.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class CompactLayoutComponent implements OnInit, OnDestroy {
    data: InitialData;
    isScreenSmall: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user: any;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        public TranslationService: TranslationService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to the resolved route mock-api
        this._activatedRoute.data.subscribe((data: Data) => {
            this.data = data.initialData;
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
        
            let users = localStorage.getItem('user');
            this.user = JSON.parse(users);
    }

    getDirection() {
        return this.TranslationService.getDirection();
    }

    getLanguage() {
        return this.TranslationService.currentLang
            ? this.TranslationService.currentLang
            : 'en';
    }

    emitLanguage(lang) {
        this.TranslationService.useLanguage(lang, true);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent(name);
        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
    goToHome() {
        this._router.navigate([AppRoutes.Dashboard]);
    }
}
