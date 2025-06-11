import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { FuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilitiesService } from 'app/services';
import { MustMatch } from 'app/modules/components/change-admin-password/change-admin-password.component';

@Component({
    selector     : 'auth-forgot-password',
    templateUrl  : './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : FuseAnimations
})
export class AuthForgotPasswordComponent implements OnInit
{
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;
    @ViewChild('newPasswordNgForm') newPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    forgotPasswordForm: FormGroup;
    showAlert: boolean = false;
    isChangePassword: boolean = false;
    isOtpScreen: boolean = false;
    newPasswordForm: FormGroup;
    otp: any = '';
    isLoading: boolean = false;
    timer = 30;
    interval: any;

    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private utilitiesService: UtilitiesService,
        private router: Router
    ) {
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });

        this.newPasswordForm = this._formBuilder.group(
            {
                new_password: ['', [Validators.required]],
                confirm_password: ['', [Validators.required]],
            },
            {
                validator: MustMatch('new_password', 'confirm_password'),
            }
        );
        this.activatedRoute.queryParams.subscribe(async (data) => {
            if (data.email) {
                this.forgotPasswordForm.controls.email.setValue(data.email);
                this.sendResetLink(false)

            }
        });
    }
    onOtpChange(otp) {
        let otpNumber: string = otp;
        if (otpNumber.length == 6) {
            this.otp = otpNumber;
        } else {
            this.otp = '';
        }
    }

    clearTimer() {
        clearInterval(this.interval);
    }

    resendOTP() {
        let email = this.forgotPasswordForm.get('email').value;
        this._authService
            .forgotPassword(email)
            .pipe(finalize(() => {}))
            .subscribe(
                (response) => {
                    let message = 'OTP is successfully send to ' + email;
                    this.utilitiesService.showSuccessToast(message);
                    this.interval = setInterval(() => {
                        if (this.timer == 1) {
                            this.clearTimer();
                            this.timer = 30;
                        } else {
                            this.timer = this.timer - 1;
                        }
                    }, 1000);
                    // Set the alert
                },
                (response) => {
                    let message = response.error.error_en
                        ? response.error.error_en
                        : 'Resend otp failed';
                    this.utilitiesService.showErrorToast(message);
                }
            );
    }

    submitOTP() {
        if (this.isLoading) {
            return;
        }
        let form = {
            email: this.forgotPasswordForm.controls.email.value,
            otp: this.otp,
        };
        this.submitOTPOrPassword(form);
    }

    getOTPLength() {
        return this.otp ? true : false;
    }

    async submitOTPOrPassword(form) {
        try {
            this.isLoading = true;
            const isValid = await this._authService
                .submitOTPOrPassword(form)
                .toPromise();
            if (isValid) {
                this.isOtpScreen = false;
                this.isChangePassword = true;
                this.isLoading = false;
            }
        } catch (e) {
            console.log(e);
            let message = e.error.error_en
                ? e.error.error_en
                : 'Email or Otp is not Valid';
            this.utilitiesService.showErrorToast(message);
            this.isLoading = false;
            this.router.navigate([]);
        } finally {
            this.isLoading = false;
        }
    }
    ngOnInit(): void {}

    async submit() {
        if (this.newPasswordForm.valid) {
            this.newPasswordForm.disable();
            let form = {
                email: this.forgotPasswordForm.controls.email.value,
                otp: this.otp,
                password: this.newPasswordForm.controls.new_password.value,
            };
            try {
                this.utilitiesService.startLoader();
                const isValid = await this._authService
                    .submitOTPOrPassword(form)
                    .toPromise();
                if (isValid) {
                    this.utilitiesService.stopLoader();
                    let message = 'Reset password successfull, Please Login';
                    this.utilitiesService.showSuccessToast(message);
                    this.router.navigate(['sign-in']);
                }
            } catch (e) {
                this.newPasswordForm.enable();
                console.log(e);
                let message = e.error.error_en
                    ? e.error.error_en
                    : 'Reset password failed';
                this.utilitiesService.showErrorToast(message);
                this.utilitiesService.stopLoader();
                this.router.navigate([]);
            } finally {
                this.utilitiesService.stopLoader();
            }
        }
    }

    resetForm() {
        this.isChangePassword = false;
        this.isOtpScreen = false;
        this.forgotPasswordNgForm.resetForm();
    }

    sendResetLink(generate_otp = true): void {
        if (this.forgotPasswordForm.invalid) {
            return;
        }
        this.forgotPasswordForm.disable();
        this.showAlert = false;
        this._authService
            .forgotPassword(this.forgotPasswordForm.get('email').value, generate_otp)
            .pipe(
                finalize(() => {
                    this.forgotPasswordForm.enable();
                })
            )
            .subscribe(
                (response) => {
                    this.isChangePassword = false;
                    this.isOtpScreen = true;
                },
                (response) => {
                    this.forgotPasswordNgForm.resetForm();
                    let message = response.error.error_en
                        ? response.error.error_en
                        : 'Email does not found! Are you sure you are already a member?';
                    this.utilitiesService.showErrorToast(message);
                }
            );
    }
}
