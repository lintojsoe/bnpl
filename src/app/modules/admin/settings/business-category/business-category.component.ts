import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { TranslateService } from '@ngx-translate/core';
import { AppRoutes } from 'app/AppRoutes';
import { Crumb } from 'app/modules/admin/customers/customer.types';
import { AddBankNamesComponent } from 'app/modules/components/add-bank-names/add-bank-names.component';
import { AddBusinessCategoryComponent } from 'app/modules/components/add-business-category/add-business-category.component';
import { AlertModalComponent } from 'app/modules/components/alert-modal/alert-modal.component';
import { Pagination } from 'app/pagination';
import { AuthUSerService } from 'app/services/authUserService';
import { SettingsService } from 'app/services/settings/settings.service';
import { TranslationService } from 'app/services/translationService';
import { UtilitiesService } from 'app/services/utilitiesService';
import { debounceTime } from 'rxjs/operators';
import { SettingsComponent } from '../settings.component';

@Component({
    selector: 'app-business-category',
    templateUrl: './business-category.component.html',
    styleUrls: ['./business-category.component.scss'],
    animations: FuseAnimations,
})
export class BusinessCategoryComponent implements OnInit {
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
    categoryList = [];
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

    toggleDrawer() {
        this.settingsComponent.matDrawer.toggle();
    }

    async ngOnInit(): Promise<void> {
        this.utilitiesService.startLoader();
        this.form = this.fb.group({
            name_ar: [''],
            name_en: [''],
        });
        this.setBreadcrumbs();
        await this.getBusinessCatList();
        this.form.valueChanges.pipe(debounceTime(500)).subscribe((data) => {
            this.page = new Pagination().page;
            this.getBusinessCatList();
        });
    }

    async getBusinessCatList(
        limit = this.page.pageSize,
        offset = this.page.offset,
        form = this.form.controls
    ) {
        try {
            this.utilitiesService.startLoader();
            let categoryList = await this.settingsService
                .getBusinessCategory(limit, offset, '', form)
                .toPromise();
            if (categoryList) {
                this.page.length = categoryList.count;
                this.categoryList = categoryList.results;
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
        const dialogRef = this.dialog.open(AddBusinessCategoryComponent, {
            data: { row },
            maxWidth: '',
            width: `${size.width}`,
            height: `${size.height}`,
        });

        dialogRef.afterClosed().subscribe(async (resp) => {
            if (resp) {
                if (!id) {
                    this.addCategory(resp);
                } else {
                    this.updateCategory(resp, id);
                }
            }
        });
    }
    async addCategory(form) {
        try {
            this.utilitiesService.startLoader();
            let successmsg = this.translateService.instant(
                'Business Category added successfully'
            );
            const category = await this.settingsService
                .addBusinessCategory(form)
                .toPromise();
            if (category) {
                this.getBusinessCatList();
                this.utilitiesService.stopLoader();
                this.utilitiesService.showSuccessToast(successmsg);
            }
        } catch {
        } finally {
        }
    }
    async updateCategory(form, id) {
        try {
            this.utilitiesService.startLoader();
            let successmsg = this.translateService.instant(
                'Business Category updated successfully'
            );
            const category = await this.settingsService
                .updateBusinessCategory(form, id)
                .toPromise();
            if (category) {
                this.getBusinessCatList();
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
                path: `${AppRoutes.BusinessCategory}`,
                relative: false,
                name_en: 'Business Category',
                name_ar: 'نوع العمل ',
            },
        ];
    }
    async handlePageEvent(event) {
        this.page.length = event.length;
        this.page.pageSize = event.pageSize;
        this.page.pageIndex = event.pageIndex;
        this.page.offset = this.page.pageIndex * this.page.pageSize;
        await this.getBusinessCatList();
    }
    deleteCategory(id) {
        try {
            let content = this.translateService.instant(
                'Are you sure, Do you want to delete this category?'
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
                            .deleteCategory(id)
                            .subscribe((data) => {
                                let successmsg = this.translateService.instant(
                                    'Business Category deleted successfully'
                                );
                                this.utilitiesService.showSuccessToast(
                                    successmsg
                                );
                                this.getBusinessCatList();
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
