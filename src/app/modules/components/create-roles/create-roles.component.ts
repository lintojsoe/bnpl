import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { AppRoutes } from 'app/AppRoutes';
import { Crumb } from 'app/modules/admin/customers/customer.types';
import { RolesService } from 'app/services/roles/roles.service';
import { TranslationService } from 'app/services/translationService';
import { Location } from '@angular/common';
import { UtilitiesService } from 'app/services/utilitiesService';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';

@Component({
    selector: 'app-create-roles',
    templateUrl: './create-roles.component.html',
    styleUrls: ['./create-roles.component.scss'],
    animations: FuseAnimations,
})
export class CreateRolesComponent implements OnInit {
    breadcrumbs: Crumb[] = [];
    id: any = '';
    form: FormGroup;
    allPermmissionList = [];
    checkedOrUnchecked = [];
    checkBoxArray = [];
    rolesDetails: any = '';
    constructor(
        private activatedRoute: ActivatedRoute,
        public translationService: TranslationService,
        private fb: FormBuilder,
        private rolesService: RolesService,
        private _location: Location,
        private utilitiesService: UtilitiesService,
        private translateService: TranslateService,
        private dialog: MatDialog,
        private route: Router
    ) {
        this.activatedRoute.params.subscribe((data) => {
            console.log(data['id']);
            this.id = data['id'];
        });
    }

    async ngOnInit(): Promise<void> {
        if (this.id) {
            this.utilitiesService.startLoader();
        }
        await this.formInit();
        this.setBreadcrumbs();
        await this.getAllPermission();
        if (this.id) {
            await this.getDetails();
        }
    }
    async formInit() {
        this.form = this.fb.group({
            name: [this.rolesDetails ? this.rolesDetails.name : null],
            name_en: [
                this.rolesDetails ? this.rolesDetails.name_en : null,
                [Validators.required],
            ],
            name_ar: [this.rolesDetails ? this.rolesDetails.name_ar : null],
            permissions: [''],
        });
    }
    async getDetails() {
        try {
            const customerDetails = await this.rolesService
                .getRolesDetails(this.id)
                .toPromise();
            if (customerDetails) {
                this.rolesDetails = customerDetails;
                await this.checkboxPrefilled();
                await this.formInit();
                this.utilitiesService.stopLoader();
            }
        } catch {
        } finally {
        }
    }
    async checkboxPrefilled() {
        if (this.allPermmissionList) {
            this.allPermmissionList.forEach((per) => {
                per.permissions.forEach((items) => {
                    this.checkedOrUnchecked[items.id] = false;
                    this.rolesDetails.permission.forEach((data) => {
                        if (items.codename == data) {
                            this.checkedOrUnchecked[items.id] = true;
                            this.checkBoxArray.push(items.id);
                            this.checkBoxArray = this.checkBoxArray.filter(
                                function (elem, index, self) {
                                    return index === self.indexOf(elem);
                                }
                            );
                        }
                    });
                });
            });
        }
    }
    checkForModal(event, index) {
        this.allPermmissionList.forEach((permission, innerIndex) => {
            if (event.checked) {
                if (index == innerIndex) {
                    permission.permissions.forEach((data) => {
                        this.checkedOrUnchecked[data.id] = true;
                        this.checkBoxArray.push(data.id);
                        this.checkBoxArray = this.checkBoxArray.filter(
                            function (elem, index, self) {
                                return index === self.indexOf(elem);
                            }
                        );
                    });
                }
            } else {
                if (innerIndex == index) {
                    permission.permissions.forEach((data) => {
                        this.checkedOrUnchecked[data.id] = false;
                        this.checkBoxArray = this.checkBoxArray.filter(
                            (items) => items != data.id
                        );
                    });
                }
            }
            this.checkedOrUnchecked = [...this.checkedOrUnchecked];
        });
    }
    checkAllChecked(permissions) {
        let checked = false;
        let allChecked = 0;
        if (permissions) {
            if (this.checkBoxArray) {
                this.checkBoxArray.forEach((data) => {
                    permissions.forEach((items) => {
                        if (items.id == data) {
                            allChecked = allChecked + 1;
                        }
                    });
                });
                if (permissions.length == allChecked) {
                    checked = true;
                } else {
                    checked = false;
                }
            }
        }
        return checked;
    }
    checkBoxChange(event, id) {
        if (event.checked) {
            this.checkedOrUnchecked[id] = true;
            this.checkBoxArray.push(id);
            this.checkBoxArray = this.checkBoxArray.filter(function (
                elem,
                index,
                self
            ) {
                return index === self.indexOf(elem);
            });
        } else {
            this.checkedOrUnchecked[id] = false;
            this.checkBoxArray = this.checkBoxArray.filter(
                (data) => data != id
            );
        }
    }
    async getAllPermission() {
        try {
            this.utilitiesService.startLoader();
            let allPermmissionList = await this.rolesService
                .getAllPermissions()
                .toPromise();
            if (allPermmissionList) {
                this.allPermmissionList = allPermmissionList;
                this.utilitiesService.stopLoader();
            }
        } catch {
            this.utilitiesService.stopLoader();
        } finally {
        }
    }
    setBreadcrumbs() {
        this.breadcrumbs = [
            {
                absolute: true,
                disabled: false,
                path: `${AppRoutes.Roles}`,
                relative: false,
                name_en: 'Roles & Permissions',
                name_ar: 'التجار',
            },
            {
                absolute: true,
                disabled: true,
                path: ``,
                relative: false,
                name_en: this.id ? 'Edit' : 'Create',
                name_ar: this.id ? 'تعديل' : 'خلق',
            },
        ];
    }
    save() {
        if (this.form.valid) {
            this.checkBoxArray = this.checkBoxArray.filter(function (
                elem,
                index,
                self
            ) {
                return index === self.indexOf(elem);
            });
            let permissionArray = [];
            if (this.checkBoxArray.length && this.allPermmissionList.length) {
                this.checkBoxArray.forEach((id) => {
                    this.allPermmissionList.forEach((items) => {
                        items.permissions.forEach((permission) => {
                            if (permission.id == id) {
                                permissionArray.push(permission.codename);
                            }
                        });
                    });
                });
            }
            let form = this.form.value;
            form.permissions = permissionArray;
            console.log(form.permissions)
            form.name = form.name_en;
            if (this.id) {
                this.upatePermission(form);
            } else {
                this.savePermission(form);
            }
        } else {
            for (const key of Object.keys(this.form.controls)) {
                this.form.controls[key].markAllAsTouched();
            }
        }
    }
    upatePermission(form) {
        try {
            let content = this.translateService.instant(
                'Are you sure, Do you want to update ?'
            );
            let heading = this.translateService.instant('Update');
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
                    let success = this.translateService.instant(
                        'Role updated successfully'
                    );
                    const customer = await this.rolesService
                        .updateRole(form, this.id)
                        .toPromise();
                    if (customer) {
                        this.utilitiesService.showSuccessToast(success);
                        this.utilitiesService.stopLoader();
                        this.route.navigate([AppRoutes.Roles]);
                    }
                }
            });
        } catch {
            this.utilitiesService.stopLoader();
        } finally {
        }
    }
    savePermission(form) {
        try {
            let content = this.translateService.instant(
                'Are you sure, Do you want to save ?'
            );
            let heading = this.translateService.instant('Save');
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
                    let success = this.translateService.instant(
                        'Role created successfully'
                    );
                    const customer = await this.rolesService
                        .addRole(form)
                        .toPromise();
                    if (customer) {
                        this.utilitiesService.showSuccessToast(success);
                        this.utilitiesService.stopLoader();
                        this.route.navigate([AppRoutes.Roles]);
                    }
                }
            });
        } catch {
            this.utilitiesService.stopLoader();
        } finally {
        }
    }
    goBack() {
        this._location.back();
    }
}
