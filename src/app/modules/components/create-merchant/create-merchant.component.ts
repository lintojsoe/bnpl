import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
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
import { OutletsService } from 'app/services/outlets/outlets.service';
import { CustomerService } from 'app/services/customer/customer.service';
import { DocumentsComponent } from '../documents/documents.component';
import { AdditionalService } from 'app/services/additionalService';
import { ValidateInputs } from 'app/inputValidation';
import {
    InputValidationContract,
    InputValidationCustomer,
} from 'app/input-validation';
import { debounceTime, map, take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { SettingsService } from 'app/services/settings/settings.service';
import { Validations } from 'app/shared/validations';

@Component({
    selector: 'app-create-merchant',
    templateUrl: './create-merchant.component.html',
    styleUrls: ['./create-merchant.component.scss'],
    animations: FuseAnimations,
})
export class CreateMerchantComponent implements OnInit {
    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
    @ViewChild(DocumentsComponent)
    documentsComponent: DocumentsComponent;
    public countryControl: FormControl = new FormControl();
    protected _onDestroy = new Subject<void>();
    public filteredCountry: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    id: any = '';
    breadcrumbs: Crumb[] = [];
    businessCategory = [];
    bankNames = [];
    merchantDetails: any;
    countryList = [];
    afterViewInit = false;
    isLoadingEmail: boolean = false;
    isLoadingContact: boolean = false;
    isLoadingIban: boolean = false;
    emailError: boolean;
    contactError: boolean;
    ibanNoError: boolean;
    today = new Date();

    constructor(
        private fb: FormBuilder,
        private utilitiesService: UtilitiesService,
        private route: Router,
        private activatedRoute: ActivatedRoute,
        public translationService: TranslationService,
        private _location: Location,
        private translateService: TranslateService,
        private dialog: MatDialog,
        private outletsService: OutletsService,
        private customerService: CustomerService,
        private validateInputs: ValidateInputs,
        private additionalService: AdditionalService,
        private settingsService: SettingsService
    ) {
        this.activatedRoute.params.subscribe((data) => {
            console.log(data['id']);
            this.id = data['id'];
        });
    }

    filesFront: any = [];
    filesBack: any = [];
    form: FormGroup;
    async ngOnInit(): Promise<void> {
        this.utilitiesService.startLoader();
        this.setBreadcrumbs();
        await this.formInit();
        await this.getBusinessCategory();
        await this.getBankNames();
        await this.getCountryList();
        if (this.id) {
            await this.getMerchantsDetails();
            await this.formInit();
        }
        this.afterViewInit = true;
        this.filteredCountry.next(this.countryList.slice());
        this.countryControl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterCountry();
            });
    }
    async getBusinessCategory() {
        try {
            let businessCategory = await this.settingsService
                .getBusinessCategory(99999, 0)
                .toPromise();
            if (businessCategory) {
                this.businessCategory = businessCategory.results;
            }
        } catch {
        } finally {
        }
    }
    async getBankNames() {
        try {
            let bankNames = await this.settingsService
                .getBankNames(999999, 0)
                .toPromise();
            if (bankNames) {
                this.bankNames = bankNames.results;
            }
        } catch {
        } finally {
        }
    }
    protected setInitialValue() {
        this.filteredCountry
            .pipe(take(1), takeUntil(this._onDestroy))
            .subscribe(() => {
                this.singleSelect.compareWith = (a: any, b: any) =>
                    a && b && a.id === b.id;
            });
    }
    protected filterCountry() {
        if (!this.countryList) {
            return;
        }
        let search = this.countryControl.value;
        console.log(search);
        if (!search) {
            this.filteredCountry.next(this.countryList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filteredCountry.next(
            this.countryList.filter(
                (nationality) =>
                    nationality.name.toLowerCase().indexOf(search) > -1
            )
        );
    }
    ngAfterViewInit() {
        this.setInitialValue();
    }
    async getCountryList() {
        try {
            let countryList = await this.customerService
                .getCountryList()
                .toPromise();
            if (countryList) {
                this.countryList = countryList;
            }
        } catch {
        } finally {
        }
    }
    async getMerchantsDetails() {
        try {
            let merchantDetails = await this.outletsService
                .getMerchantsDetails(this.id)
                .toPromise();
            if (merchantDetails) {
                this.merchantDetails = merchantDetails;
                this.utilitiesService.stopLoader();
            }
        } catch {
            this.utilitiesService.stopLoader();
        } finally {
        }
    }

    async formInit() {
        this.form = this.fb.group({
            name: [
                this.merchantDetails ? this.merchantDetails.name : null,
                [Validators.required],
            ],
            email: [
                this.merchantDetails ? this.merchantDetails.email : null,
                [Validators.required, Validators.email],
            ],
            contact_no: [
                this.merchantDetails ? this.merchantDetails.contact_no : null,
                [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
            ],
            address: [
                this.merchantDetails ? this.merchantDetails.address : null,
            ],
            city: [this.merchantDetails ? this.merchantDetails.city : null],
            country_id: [
                this.merchantDetails
                    ? this.merchantDetails.country
                        ? this.merchantDetails.country
                        : null
                    : null,
                [Validators.required]
            ],
            pb_no: [this.merchantDetails ? this.merchantDetails.pb_no : null],
            // vat_registration: [
            //     this.merchantDetails
            //         ? this.merchantDetails.vat_registration
            //         : null,
            //     [Validators.required],
            // ],
            // vat_issue_date: [
            //     this.merchantDetails
            //         ? this.merchantDetails.vat_issue_date
            //         : null,
            //     [Validators.required],
            // ],
            trade_license_number: [
                this.merchantDetails
                    ? this.merchantDetails.trade_license_number
                    : null,
                [Validators.required,Validators.pattern(/^(?:[a-zA-Z0-9\s]+)?$/)],
            ],
            license_issue_date: [
                this.merchantDetails
                    ? this.merchantDetails.license_issue_date
                    : null,
                [Validators.required],
            ],
            license_expiry_date: [
                this.merchantDetails
                    ? this.merchantDetails.license_expiry_date
                    : null,
                [Validators.required],
            ],
            // license_issue_country_id: [
            //     this.merchantDetails
            //         ? this.merchantDetails.license_issue_country
            //             ? this.merchantDetails.license_issue_country.id
            //             : null
            //         : null,
            // ],
            authorized_signatory_id: [
                this.merchantDetails
                    ? this.merchantDetails.authorized_signatory_id
                    : null,
                [Validators.required],
            ],
            id_expiry_date: [
                this.merchantDetails
                    ? this.merchantDetails.id_expiry_date
                    : null,
                [Validators.required],
            ],
            id_dob: [
                this.merchantDetails ? this.merchantDetails.id_dob : null,
                [Validators.required],
            ],

            id_name: [
                this.merchantDetails ? this.merchantDetails.id_name : null,
                [Validators.required],
            ],
            // id_issue_country_id: [
            //     this.merchantDetails
            //         ? this.merchantDetails.id_issue_country
            //             ? this.merchantDetails.id_issue_country.id
            //             : null
            //         : null,
            //     [Validators.required],
            // ],
            bank_id: [
                this.merchantDetails
                    ? this.merchantDetails.bank
                        ? this.merchantDetails.bank.id
                        : null
                    : null,
                [Validators.required],
            ],
            bank_account_no: [
                this.merchantDetails
                    ? this.merchantDetails.bank_account_no
                    : null,
                [Validators.required, Validators.pattern(Validations.AccountNumberPattern)],
            ],
            iban_no: [
                this.merchantDetails ? this.merchantDetails.iban_no : null,
                [Validators.required,Validators.pattern(/^(?:[a-zA-Z0-9\s]+)?$/)],
            ],
            bank_account_name: [
                this.merchantDetails
                    ? this.merchantDetails.bank_account_name
                    : null,
                [Validators.required],
            ],
            logo: [this.merchantDetails ? this.merchantDetails.logo : null],
            business_category_id: [
                this.merchantDetails
                    ? this.merchantDetails.business_category
                        ? this.merchantDetails.business_category.id
                            ? this.merchantDetails.business_category.id
                            : ''
                        : ''
                    : '',
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
                        'account',
                        this.id
                    );
                    this.setError(value, 'email');
                }
            });
        this.form.controls.contact_no.valueChanges
            .pipe(debounceTime(600))
            .subscribe(async (data) => {
                this.isLoadingContact = true;
                const value = await this.validateInputs.inputValidation(
                    data,
                    'contact_no',
                    'account',
                    this.id
                );
                this.setError(value, 'contact_no');
            });
        this.form.controls.iban_no.valueChanges
            .pipe(debounceTime(600))
            .subscribe(async (data) => {
                this.isLoadingIban = true;
                const value = await this.validateInputs.inputValidation(
                    data,
                    'iban_no',
                    'account',
                    this.id
                );
                this.setError(value, 'iban_no');
            });
        if (this.id) {
            this.form.controls.email.disable();
        }
    }

    isEmailError() {
        return this.emailError;
    }
    isErrorContact() {
        return this.contactError;
    }
    isIBANError() {
        return this.ibanNoError;
    }

    setError(value, name) {
        if (value) {
            if (name == 'email') {
                this.emailError = true;
            }
            if (name == 'contact_no') {
                this.contactError = true;
            }
            if (name == 'iban_no') {
                this.ibanNoError = true;
            }
        } else {
            this.emailError = false;
            this.contactError = false;
            this.ibanNoError = false;
        }
        this.isLoadingContact = false;
        this.isLoadingEmail = false;
        this.isLoadingIban = false;
    }

    setBreadcrumbs() {
        this.breadcrumbs = [
            {
                absolute: true,
                disabled: false,
                path: `${AppRoutes.Merchants}`,
                relative: false,
                name_en: 'Merchants',
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
    goBack() {
        this._location.back();
    }

    uploadFile(files) {
        let reader = this.utilitiesService.convertImageToBase64(files[0]);
        reader.onload = (readerEvt: any) => {
            this.form.controls.logo.setValue(readerEvt.target.result);
        };
    }

    deleteLogo() {
        this.form.controls.logo.setValue(null);
    }

    save() {
        if (this.form.valid && !this.contactError && !this.emailError) {
            let form = this.form.value;
            let country_id = form.country_id.id
                ? form.country_id.id
                : form.country_id;
            form.country_id = country_id;
            form.id_dob = this.utilitiesService.formatDate(form.id_dob)
            form.id_expiry_date = this.utilitiesService.formatDate(form.id_expiry_date)
            form.license_expiry_date = this.utilitiesService.formatDate(form.license_expiry_date)
            form.license_issue_date = this.utilitiesService.formatDate(form.license_issue_date)
            let documents = this.documentsComponent.form.value;
            if (!this.documentsComponent.form.valid) {
                let error = this.translateService.instant(
                    'Documents are mandatory'
                );
                this.utilitiesService.showErrorToast(error);
            } else {
                form.documents = documents.documents;
                form.documents.forEach((data, index) => {
                    if (!data.id) {
                        delete data.id;
                    }
                });
                let formDocuments = [
                    ...form.documents.filter((data) => data.document),
                ];
                form.documents = [...formDocuments];
                if (!this.id) {
                    try {
                        let content = this.translateService.instant(
                            'Are you sure, Do you want to save ?'
                        );
                        let heading = this.translateService.instant('Save');
                        let fromApp = false;
                        let size = this.utilitiesService.isMobileAlertModal();
                        const dialogRef = this.dialog.open(
                            AlertModalComponent,
                            {
                                data: { content, heading, fromApp },
                                maxWidth: '',
                                width: `${size.width}`,
                                height: `${size.height}`,
                            }
                        );
                        dialogRef.afterClosed().subscribe(async (resp) => {
                            if (resp) {
                                let add = await this.outletsService
                                    .addMerchants(form)
                                    .toPromise();
                                if (add) {
                                    let successmsg =
                                        this.translateService.instant(
                                            'Merchant created successfully'
                                        );
                                    this.utilitiesService.showSuccessToast(
                                        successmsg
                                    );
                                    this.route.navigate([AppRoutes.Merchants]);
                                }
                            }
                        });
                    } catch {
                    } finally {
                        // this.utilitiesService.stopLoader();
                    }
                } else {
                    try {
                        let content = this.translateService.instant(
                            'Are you sure, Do you want to update ?'
                        );
                        let heading = this.translateService.instant('Update');
                        let fromApp = false;
                        let size = this.utilitiesService.isMobileAlertModal();
                        const dialogRef = this.dialog.open(
                            AlertModalComponent,
                            {
                                data: { content, heading, fromApp },
                                maxWidth: '',
                                width: `${size.width}`,
                                height: `${size.height}`,
                            }
                        );
                        dialogRef.afterClosed().subscribe(async (resp) => {
                            if (resp) {
                                let add = await this.outletsService
                                    .updateMerchants(form, this.id)
                                    .toPromise();
                                if (add) {
                                    let successmsg =
                                        this.translateService.instant(
                                            'Merchant updated successfully'
                                        );
                                    this.utilitiesService.showSuccessToast(
                                        successmsg
                                    );
                                    this.route.navigate([AppRoutes.Merchants]);
                                }
                            }
                        });
                    } catch {
                    } finally {
                        this.utilitiesService.stopLoader();
                    }
                }
            }
        } else {
            for (const key of Object.keys(this.form.controls)) {
                this.form.controls[key].markAllAsTouched();
            }
        }
    }
    getDocument() {
        let documents = [];
        try {
            if (this.merchantDetails && this.merchantDetails.documents) {
                documents = this.merchantDetails.documents;
            }
            return documents;
        } catch { }
    }
}
