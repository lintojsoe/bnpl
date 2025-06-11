import { Component, Inject, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslationService } from 'app/services/translationService';

export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}

@Component({
    selector: 'app-change-admin-password',
    templateUrl: './change-admin-password.component.html',
    styleUrls: ['./change-admin-password.component.scss'],
})
export class ChangeAdminPasswordComponent implements OnInit {
    form: FormGroup;
    userName: any = '';
    constructor(
        public dialogRef: MatDialogRef<ChangeAdminPasswordComponent>,
        private formBuilder: FormBuilder,
        private translationService: TranslationService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.userName = data ? data.fullname : null;
    }

    get passwordValue() {
        return this.form.controls.new_password.value;
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group(
            {
                old_password: ['', [Validators.required]],
                new_password: ['', [Validators.required]],
                confirm_password: ['', [Validators.required]],
                user: [''],
            },
            {
                validator: MustMatch('new_password', 'confirm_password'),
            }
        );
    }
    send() {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        } else {
            for (const key of Object.keys(this.form.controls)) {
                this.form.controls[key].markAllAsTouched();
            }
        }
    }
    close() {
        this.dialogRef.close(false);
    }
}
