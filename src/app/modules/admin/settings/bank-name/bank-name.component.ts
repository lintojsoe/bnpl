import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { TranslateService } from '@ngx-translate/core';
import { AppRoutes } from 'app/AppRoutes';
import { Crumb } from 'app/modules/admin/customers/customer.types';
import { AddBankNamesComponent } from 'app/modules/components/add-bank-names/add-bank-names.component';
import { AlertModalComponent } from 'app/modules/components/alert-modal/alert-modal.component';
import { Pagination } from 'app/pagination';
import { AuthUSerService } from 'app/services/authUserService';
import { SettingsService } from 'app/services/settings/settings.service';
import { TranslationService } from 'app/services/translationService';
import { UtilitiesService } from 'app/services/utilitiesService';
import { debounceTime } from 'rxjs/operators';
import { SettingsComponent } from '../settings.component';

@Component({
    selector: 'app-bank-name',
    templateUrl: './bank-name.component.html',
    styleUrls: ['./bank-name.component.scss'],
    animations: FuseAnimations,
})
export class BankNameComponent implements OnInit {
    page = new Pagination().page;
    breadcrumbs: Crumb[] = [];
    productsTableColumns: string[] = [
        'name_en',
        'name_ar',
        'created',
        'updated',
        'action',
    ];
    form: FormGroup;
    bankNameList = [];
    constructor(
        public authUserService: AuthUSerService,
        public utilitiesService: UtilitiesService,
        private fb: FormBuilder,
        private settingsService: SettingsService,
        private route: Router,
        public translationService: TranslationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private dialog: MatDialog,
        private translateService: TranslateService,
        private settingsComponent: SettingsComponent
    ) {}

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    async ngOnInit(): Promise<void> {
        this.form = this.fb.group({
            name_en: [''],
            name_ar: [''],
        });
        this.setBreadcrumbs();
        await this.getBankNames();
        this.form.valueChanges.pipe(debounceTime(500)).subscribe((data) => {
            this.page = new Pagination().page;
            this.getBankNames();
        });
    }

    async getBankNames(
        limit = this.page.pageSize,
        offset = this.page.offset,
        form = this.form.controls
    ) {
        try {
            this.utilitiesService.startLoader();
            let bankNameList = await this.settingsService
                .getBankNames(limit, offset, '', form)
                .toPromise();
            if (bankNameList) {
                this.page.length = bankNameList.count;
                this.bankNameList = bankNameList.results;
                this.utilitiesService.stopLoader();
                this._changeDetectorRef.markForCheck();
            } else {
                this.utilitiesService.stopLoader();
            }
        } catch {
            this.utilitiesService.stopLoader();
        } finally {
        }
    }
    edit(rowObject) {
        this.addBtnClick(rowObject.id, rowObject);
    }
    async addBtnClick(id?, row?) {
        let isMobile = this.utilitiesService.isMobile();
        let size = {
            width: '50vw',
            height: '50vh',
        };
        if (isMobile) {
            size.height = '100%';
            size.width = '100%';
        }
        const dialogRef = this.dialog.open(AddBankNamesComponent, {
            data: { row },
            maxWidth: '',
            width: `${size.width}`,
            height: `${size.height}`,
        });

        dialogRef.afterClosed().subscribe(async (resp) => {
            if (resp) {
                if (!id) {
                    this.addBankNames(resp);
                } else {
                    this.updateBankNames(resp, id);
                }
            }
        });
    }
    async addBankNames(form) {
        try {
            this.utilitiesService.startLoader();
            let successmsg = this.translateService.instant(
                'Bank name added successfully'
            );
            const notification = await this.settingsService
                .addBankName(form)
                .toPromise();
            if (notification) {
                this.getBankNames();
                this.utilitiesService.stopLoader();
                this.utilitiesService.showSuccessToast(successmsg);
            }
        } catch {
        } finally {
        }
    }
    async updateBankNames(form, id) {
        try {
            this.utilitiesService.startLoader();
            let successmsg = this.translateService.instant(
                'Bank name updated successfully'
            );
            const notification = await this.settingsService
                .updateBankName(form, id)
                .toPromise();
            if (notification) {
                this.getBankNames();
                this.utilitiesService.stopLoader();
                this.utilitiesService.showSuccessToast(successmsg);
            }
        } catch {
        } finally {
        }
    }

    setBreadcrumbs() {
        this.breadcrumbs = [
            {
                absolute: true,
                disabled: true,
                path: `${AppRoutes.BankName}`,
                relative: false,
                name_en: 'Bank Name',
                name_ar: 'اسم البنك',
            },
        ];
    }
    async handlePageEvent(event) {
        this.page.length = event.length;
        this.page.pageSize = event.pageSize;
        this.page.pageIndex = event.pageIndex;
        this.page.offset = this.page.pageIndex * this.page.pageSize;
        await this.getBankNames();
    }

    deleteBankName(id) {
        try {
            let content = this.translateService.instant(
                'Are you sure, Do you want to delete this bank name?'
            );
            let heading = this.translateService.instant('Delete');
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
                        this.settingsService
                            .deleteBankName(id)
                            .subscribe((data) => {
                                let successmsg = this.translateService.instant(
                                    'Bank name deleted successfully'
                                );
                                this.utilitiesService.showSuccessToast(
                                    successmsg
                                );
                                this.getBankNames();
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
    toggleDrawer() {
        this.settingsComponent.matDrawer.toggle();
    }
}
