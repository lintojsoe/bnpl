import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { TranslateService } from '@ngx-translate/core';
import { AppRoutes } from 'app/AppRoutes';
import { AlertModalComponent } from 'app/modules/components/alert-modal/alert-modal.component';
import { Pagination } from 'app/pagination';
import { AuthUSerService } from 'app/services/authUserService';
import { OutletsService } from 'app/services/outlets/outlets.service';
import { TranslationService } from 'app/services/translationService';
import { UtilitiesService } from 'app/services/utilitiesService';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Crumb, OutletTypes } from '../customers/customer.types';

@Component({
    selector: 'app-outlets',
    templateUrl: './outlets.component.html',
    styleUrls: ['./outlets.component.scss'],
    animations: FuseAnimations,
})
export class OutletsComponent implements OnInit {
    outlets: OutletTypes[] = [];
    breadcrumbs: Crumb[] = [];
    page = new Pagination().page;
    productsCount: number = 0;
    productsTableColumns: string[] = [
        'logo',
        'outlet_name',
        'outlet_address',
        'outlet_reference',
        'action',
    ];
    form: FormGroup;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    searchKey: string;

    constructor(
        private route: Router,
        public translationService: TranslationService,
        private outletsService: OutletsService,
        public utilitiesService: UtilitiesService,
        private fb: FormBuilder,
        public authUserService: AuthUSerService,
        private translateService: TranslateService,
        private dialog: MatDialog
    ) {}

    async ngOnInit(): Promise<void> {
        this.form = this.fb.group({
            address: [''],
            name: [''],
            reference: [''],
        });
        this.setBreadcrumbs();
        await this.getMerchants();
        this.form.valueChanges.pipe(debounceTime(500)).subscribe((data) => {
            this.page = new Pagination().page;
            this.getMerchants();
        });
    }
    async getMerchants(
        limit = this.page.pageSize,
        offset = this.page.offset,
        form = this.form.controls
    ) {
        try {
            this.utilitiesService.startLoader();
            let outlets = await this.outletsService
                .getMerchants(limit, offset, this.searchKey, form)
                .toPromise();
            if (outlets) {
                this.page.length = outlets.count;
                this.outlets = outlets.results;
                this.utilitiesService.stopLoader();
            } else {
                this.utilitiesService.stopLoader();
            }
        } catch {
            this.utilitiesService.stopLoader();
        } finally {
        }
    }

    async handlePageEvent(event) {
        this.page.length = event.length;
        this.page.pageSize = event.pageSize;
        this.page.pageIndex = event.pageIndex;
        this.page.offset = this.page.pageIndex * this.page.pageSize;
        await this.getMerchants();
    }

    setBreadcrumbs() {
        this.breadcrumbs = [
            {
                absolute: true,
                disabled: true,
                path: `${AppRoutes.Merchants}`,
                relative: false,
                name_en: 'Merchants',
                name_ar: 'التجار',
            },
        ];
    }

    ngAfterViewInit(): void {}

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    addBtnClick() {
        this.route.navigate([`${AppRoutes.Merchants}/create`]);
    }
    edit(id) {
        this.route.navigate([`${AppRoutes.Merchants}/edit/${id}`]);
    }
    viewTransactions(id) {
        this.route.navigate([`${AppRoutes.Merchants}/view-payouts/${id}`]);
    }
    view(id) {
        this.route.navigate([`${AppRoutes.Merchants}/view/${id}`]);
    }

    disableUser(id) {
        try {
            let content = this.translateService.instant(
                'Are you sure, Do you want to disable this merchant?'
            );
            let heading = this.translateService.instant('Disable');
            let fromApp = false;
            let size = this.utilitiesService.isMobileAlertModal();
            const dialogRef = this.dialog.open(AlertModalComponent, {
                data: { content, heading, fromApp },
                maxWidth: '',
                width: `${size.width}`,
                height: `${size.height}`,
            });
            dialogRef.afterClosed().subscribe(async (resp) => {
                if (resp) {
                    this.utilitiesService.startLoader();
                    try {
                        let form = {
                            is_active: false,
                        };
                        this.outletsService
                            .enableOrDisableMerchant(id, form)
                            .subscribe((data) => {
                                let successmsg = this.translateService.instant(
                                    'Merchant disabled successfully'
                                );
                                this.utilitiesService.showSuccessToast(
                                    successmsg
                                );
                                this.getMerchants();
                            });
                    } catch {
                    } finally {
                    }
                }
            });
        } catch {
        } finally {
            this.utilitiesService.stopLoader();
        }
    }
    enableUser(id) {
        try {
            let content = this.translateService.instant(
                'Are you sure, Do you want to enable this merchant?'
            );
            let heading = this.translateService.instant('Enable');
            let fromApp = false;
            let size = this.utilitiesService.isMobileAlertModal();
            const dialogRef = this.dialog.open(AlertModalComponent, {
                data: { content, heading, fromApp },
                maxWidth: '',
                width: `${size.width}`,
                height: `${size.height}`,
            });
            dialogRef.afterClosed().subscribe(async (resp) => {
                if (resp) {
                    this.utilitiesService.startLoader();
                    try {
                        let form = {
                            is_active: true,
                        };
                        this.outletsService
                            .enableOrDisableMerchant(id, form)
                            .subscribe((data) => {
                                let successmsg = this.translateService.instant(
                                    'Merchant enabled successfully'
                                );
                                this.utilitiesService.showSuccessToast(
                                    successmsg
                                );
                                this.getMerchants();
                            });
                    } catch {
                    } finally {
                    }
                }
            });
        } catch {
        } finally {
            this.utilitiesService.stopLoader();
        }
    }
}
