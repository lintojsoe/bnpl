import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AppRoutes } from 'app/AppRoutes';
import { AuthService } from 'app/core/auth/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;
    step1Password: boolean = true;
    step2Newpassword: boolean = false;
    step3Done: boolean = false;
    resetPasswordForm: FormGroup;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private route: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.resetPasswordForm = this._formBuilder.group(
            {
                oldPassword: ['', Validators.required],
                password: ['', Validators.required],
                passwordConfirm: ['', Validators.required],
            },
            {
                validators: FuseValidators.mustMatch(
                    'password',
                    'passwordConfirm'
                ),
            }
        );
    }

    checkPassword() {
        this.step1Password = false;
        this.step2Newpassword = true;
        this.step3Done = false;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void {
        // Return if the form is invalid
        if (this.resetPasswordForm.invalid) {
            return;
        }

        // Disable the form
        this.resetPasswordForm.disable();

        // Hide the alert

        // Send the request to the server
        this._authService
            .resetPassword(this.resetPasswordForm.get('password').value)
            .pipe(
                finalize(() => {
                    // Re-enable the form
                    this.resetPasswordForm.enable();

                    // Reset the form
                    this.resetPasswordNgForm.resetForm();

                    // Show the alert
                })
            )
            .subscribe((response) => {
                this.step1Password = false;
                this.step2Newpassword = false;
                this.step3Done = true;
            });
    }
    onOtpChange(event) {
        let otp: string = event;
        if (otp.length == 6) {
            console.log(event);
            this.step1Password = false;
            this.step2Newpassword = false;
            this.step3Done = true;
        }
    }
    backToDashboard() {
        this.route.navigate([AppRoutes.Dashboard]);
    }
}
