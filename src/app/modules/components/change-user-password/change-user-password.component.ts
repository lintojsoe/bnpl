import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    selector: 'app-change-user-password',
    templateUrl: './change-user-password.component.html',
    styleUrls: ['./change-user-password.component.scss'],
})
export class ChangeUserPasswordComponent implements OnInit {
    form: FormGroup;
    userName: any = '';
    constructor(
        public dialogRef: MatDialogRef<ChangeUserPasswordComponent>,
        private formBuilder: FormBuilder,
        private translationService: TranslationService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.userName = data ? data.fullname : null;
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group(
            {
                password: ['', [Validators.required]],
                confirm_password: ['', Validators.required],
                user: [''],
            },
            {
                validator: MustMatch('password', 'confirm_password'),
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
