import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { AppRoutes } from 'app/AppRoutes';
import { Crumb } from 'app/modules/admin/customers/customer.types';
import { TranslationService } from 'app/services/translationService';
import { UtilitiesService } from 'app/services/utilitiesService';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { ManageUserService } from 'app/services/manage-user/manage-user.service';
import { RolesService } from 'app/services/roles/roles.service';
import { debounceTime } from 'rxjs/operators';
import { ValidateInputs } from 'app/inputValidation';

@Component({
    selector: 'app-create-bank-user',
    templateUrl: './create-bank-user.component.html',
    styleUrls: ['./create-bank-user.component.scss'],
    animations: FuseAnimations,
})
export class CreateBankUserComponent implements OnInit {
    id: any = '';
    breadcrumbs: Crumb[] = [];
    form: FormGroup;
    userDetails: any;
    roles = [];
    isLoadingEmail: boolean;
    emailError: boolean;
    constructor(
        private fb: FormBuilder,
        private utilitiesService: UtilitiesService,
        private route: Router,
        private activatedRoute: ActivatedRoute,
        public translationService: TranslationService,
        private _location: Location,
        private translateService: TranslateService,
        private dialog: MatDialog,
        private userService: ManageUserService,
        private roleService: RolesService,
        private validateInputs: ValidateInputs
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
        this.formInit();
        this.setBreadcrumbs();
        await this.getRoles();
        let isBank = await this.utilitiesService.isBank();
        if (this.id && isBank) {
            await this.getDetails();
        }
    }
    async getRoles() {
        try {
            const roles = await this.roleService.getRoles().toPromise();
            if (roles) {
                this.roles = roles;
            }
        } catch {
        } finally {
        }
    }

    async getDetails() {
        try {
            const userDetails = await this.userService
                .getUserDetails(this.id)
                .toPromise();
            if (userDetails) {
                this.userDetails = userDetails;
                this.utilitiesService.stopLoader();
                this.formInit();
            }
        } catch {
        } finally {
        }
    }

    async formInit() {
        this.form = this.fb.group({
            first_name: [
                this.userDetails ? this.userDetails.first_name : null,
                [Validators.required],
            ],
            last_name: [this.userDetails ? this.userDetails.last_name : null],
            email: [
                this.userDetails ? this.userDetails.email : null,
                [Validators.required, Validators.email],
            ],
            contact_no: [
                this.userDetails ? this.userDetails.contact_no : null,
                [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
            ],
            role_id: [
                this.userDetails ? this.userDetails.role.id : null,
                [Validators.required],
            ],
        });
        this.form.controls.email.valueChanges
            .pipe(debounceTime(400))
            .subscribe(async (data) => {
                if (!this.id) {
                    this.isLoadingEmail = true;
                    const value = await this.validateInputs.inputValidation(
                        data,
                        'email',
                        'user',
                        this.id
                    );
                    await this.setError(value, 'email');   
                }
               
            });
        if (this.id) {
            this.form.controls.email.disable();
        }
    }

    isEmailError() {
        return this.emailError;
    }

    setError(value, name) {
        if (value) {
            if (name == 'email') {
                this.emailError = true;
            }
        } else {
            this.emailError = false;
        }
        this.form.get(name).markAsTouched();
        this.isLoadingEmail = false;
    }

    setBreadcrumbs() {
        this.breadcrumbs = [
            {
                absolute: true,
                disabled: false,
                path: `${AppRoutes.ManageUser}`,
                relative: false,
                name_en: 'Manage User',
                name_ar: 'إدارة المستخدم',
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
        if (this.form.valid && !this.emailError) {
            if (this.id) {
                this.updateUser();
            } else {
                this.addUser();
            }
        } else {
            for (const key of Object.keys(this.form.controls)) {
                this.form.controls[key].markAllAsTouched();
            }
        }
    }
    updateUser() {
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
                let form = this.form.value;
                try {
                    this.utilitiesService.startLoader();
                    const addUser = await this.userService
                        .updateUser(form, this.id)
                        .toPromise();
                    if (addUser) {
                        let successmsg = this.translateService.instant(
                            'User updated successfully'
                        );
                        this.utilitiesService.showSuccessToast(successmsg);
                        this.route.navigate([AppRoutes.ManageUser]);
                    }
                } catch {
                } finally {
                }
            }
        });
    }

    async addUser() {
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
                let form = this.form.value;
                try {
                    this.utilitiesService.startLoader();
                    const addUser = await this.userService
                        .addUser(form)
                        .toPromise();
                    if (addUser) {
                        let successmsg = this.translateService.instant(
                            'User created successfully'
                        );
                        this.utilitiesService.showSuccessToast(successmsg);
                        this.route.navigate([AppRoutes.ManageUser]);
                    }
                } catch {
                } finally {
                }
            }
        });
    }
    goBack() {
        this._location.back();
    }
}
