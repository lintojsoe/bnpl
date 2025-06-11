import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { appRoutes } from 'app/app.routing';
import { AppRoutes } from 'app/AppRoutes';
import { Crumb } from 'app/modules/admin/customers/customer.types';
import { TranslationService } from 'app/services/translationService';
import { UtilitiesService } from 'app/services/utilitiesService';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from 'app/services/customer/customer.service';
import moment from 'moment';
import { DocumentsComponent } from '../documents/documents.component';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { ValidateInputs } from 'app/inputValidation';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';

@Component({
    selector: 'app-create-customer',
    templateUrl: './create-customer.component.html',
    styleUrls: ['./create-customer.component.scss'],
    animations: FuseAnimations,
})
export class CreateCustomerComponent implements OnInit, AfterViewInit {
    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
    @ViewChild(DocumentsComponent)
    documentsComponent: DocumentsComponent;

    public nationalityControl: FormControl = new FormControl();
    breadcrumbs: Crumb[] = [];
    id: any = '';
    customerDetails: any;
    countryList = [];
    afterViewInit: boolean = false;
    isLoadingEmail: boolean = false;
    isLoadingContact: boolean = false;
    isLoadingIban: boolean = false;
    emailError = false;
    contactError = false;
    iban_noError = false;
    today = new Date();
    protected _onDestroy = new Subject<void>();
    public filteredNationality: ReplaySubject<any[]> = new ReplaySubject<any[]>(
        1
    );
    constructor(
        private fb: FormBuilder,
        private utilitiesService: UtilitiesService,
        private route: Router,
        private activatedRoute: ActivatedRoute,
        public translationService: TranslationService,
        private _location: Location,
        private translateService: TranslateService,
        private dialog: MatDialog,
        private customerService: CustomerService,
        private validateInputs: ValidateInputs
    ) {
        this.activatedRoute.params.subscribe((data) => {
            console.log(data['id']);
            this.id = data['id'];
        });
    }
    form: FormGroup;
    async ngOnInit(): Promise<void> {
        this.utilitiesService.startLoader();
        this.formInit();
        this.setBreadcrumbs();
        await this.formInit();
        await this.getCountryList();
        if (this.id) {
            await this.getCustomerDetails();
        }
        this.afterViewInit = true;
        this.filteredNationality.next(this.countryList.slice());
        this.nationalityControl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterNationality();
            });
    }
    ngAfterViewInit() {
        this.setInitialValue();
    }
    protected setInitialValue() {
        this.filteredNationality
            .pipe(take(1), takeUntil(this._onDestroy))
            .subscribe(() => {
                this.singleSelect.compareWith = (a: any, b: any) =>
                    a && b && a.id === b.id;
            });
    }
    protected filterNationality() {
        if (!this.countryList) {
            return;
        }
        let search = this.nationalityControl.value;
        console.log(search);
        if (!search) {
            this.filteredNationality.next(this.countryList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filteredNationality.next(
            this.countryList.filter(
                (nationality) =>
                    nationality.name.toLowerCase().indexOf(search) > -1
            )
        );
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
    async getCustomerDetails() {
        try {
            const customerDetails = await this.customerService
                .getCustomerDetails(this.id)
                .toPromise();
            if (customerDetails) {
                this.customerDetails = customerDetails;
                await this.formInit();
                await this.setValue();
                this.utilitiesService.stopLoader();
            }
        } catch {
        } finally {
        }
    }

    getDocument() {
        let documents = [];
        try {
            if (this.customerDetails && this.customerDetails.documents) {
                documents = this.customerDetails.documents;
            }
            return documents;
        } catch {}
    }
    async formInit() {
        this.form = this.fb.group({
            email: [
                this.customerDetails ? this.customerDetails.email : null,
                [Validators.required, Validators.email],
            ],
            first_name: [
                this.customerDetails ? this.customerDetails.first_name : null,
                [Validators.required],
            ],
            middle_name: [
                this.customerDetails ? this.customerDetails.middle_name : null,
            ],
            last_name: [
                this.customerDetails ? this.customerDetails.last_name : '',
                [Validators.required],
                ,
            ],
            contact_no: [
                this.customerDetails ? this.customerDetails.contact_no : null,
                [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
            ],
            dob: [
                this.customerDetails ? this.customerDetails.dob : null,
                [Validators.required],
            ],
            gender: [this.customerDetails ? this.customerDetails.gender : 1],
            nationality_id: [
                this.customerDetails
                    ? this.customerDetails.nationality
                        ? this.customerDetails.nationality
                        : null
                    : null,
                [Validators.required],
            ],
            occupation: [
                this.customerDetails ? this.customerDetails.occupation : null,
            ], 
            civil_id: [
                this.customerDetails ? this.customerDetails.civil_id : null,
                [Validators.required, Validators.pattern(/^(?:[a-zA-Z0-9\s]+)?$/),Validators.maxLength(14)],
            ],
            issue_date: [
                this.customerDetails ? this.customerDetails.issue_date : null,
                [Validators.required],
            ],
            expiry_date: [
                this.customerDetails ? this.customerDetails.expiry_date : null,
                [Validators.required],
            ],
            // issued_country_id: [
            //     this.customerDetails
            //         ? this.customerDetails.issued_country
            //             ? this.customerDetails.issued_country.id
            //             : null
            //         : null,
            //     [Validators.required],
            // ],
            street: [null],
            floor: [null],
            building_no: [null, [Validators.required]],
            apartment_no: [null, [Validators.required]],
            address: [null],
            paci: [this.customerDetails ? this.customerDetails.paci : null],
            overdraft_limit: [null, [Validators.required]],
            installment_no_max: [
                null,
                [Validators.required, Validators.min(3)],
            ],
            iban_no: [null, [Validators.required,Validators.pattern(/^(?:[a-zA-Z0-9\s]+)?$/)]],
            bank_details: [],
            documents: [],
            addresses: [],
            addressID: [
                this.customerDetails ? this.customerDetails.addresses.id : null,
            ],
            bankID: [
                this.customerDetails
                    ? this.customerDetails.bank_details.id
                    : null,
            ],
            user: [this.customerDetails ? this.customerDetails.user : null],
        });
        this.form.controls.email.valueChanges
            .pipe(debounceTime(400))
            .subscribe(async (data) => {
                if (!this.id) {
                    console.log(data);
                    this.isLoadingEmail = true;
                    const value = await this.validateInputs.inputValidation(
                        data,
                        'email',
                        'customer',
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
                    'customer',
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
                    'customer',
                    this.customerDetails
                        ? this.customerDetails.bank_details
                            ? this.customerDetails.bank_details.id
                            : null
                        : null
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
        return this.iban_noError;
    }

    setError(value, name) {
        debugger;
        if (value) {
            if (name == 'email') {
                this.emailError = true;
            }
            if (name == 'contact_no') {
                this.contactError = true;
            }
            if (name == 'iban_no') {
                this.iban_noError = true;
            }
        } else {
            this.emailError = false;
            this.contactError = false;
            this.iban_noError = false;
        }
        this.form.get(name).markAsTouched();
        this.isLoadingContact = false;
        this.isLoadingEmail = false;
        this.isLoadingIban = false;
    }
    async setValue() {
        try {
            let address = this.customerDetails.addresses;
            this.form.get('street').setValue(address.street);
            this.form.get('floor').setValue(address.floor);
            this.form.get('building_no').setValue(address.building_no);
            this.form.get('apartment_no').setValue(address.apartment_no);
            this.form.get('address').setValue(address.address);
            let bank = this.customerDetails.bank_details;
            this.form.get('overdraft_limit').setValue(bank.overdraft_limit);
            this.form
                .get('installment_no_max')
                .setValue(bank.installment_no_max);
            this.form.get('iban_no').setValue(bank.iban_no);
        } catch {
        } finally {
        }
    }
    setBreadcrumbs() {
        this.breadcrumbs = [
            {
                absolute: true,
                disabled: false,
                path: `${AppRoutes.Customers}`,
                relative: false,
                name_en: 'Customers',
                name_ar: 'عملاء',
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
    async saveCustomer(form) {
        console.log(form);
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
                    try {
                        this.utilitiesService.startLoader();
                        let success = this.translateService.instant(
                            'Customer created successfully'
                        );
                        console.log('testing');
                        const customer = await this.customerService
                            .addCustomer(form)
                            .toPromise();
                        console.log(customer);
                        if (customer) {
                            this.utilitiesService.showSuccessToast(success);
                            this.utilitiesService.stopLoader();
                            this.route.navigate([AppRoutes.Customers]);
                        }
                    } catch (e) {
                        console.log('catch error', e);
                    } finally {
                        this.utilitiesService.stopLoader();
                    }
                }
            });
        } catch {
            this.utilitiesService.stopLoader();
        } finally {
        }
    }
    async updateCustomer(form) {
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
                        'Customer updated successfully'
                    );
                    const customer = await this.customerService
                        .updateCustomer(form, this.id)
                        .toPromise();
                    if (customer) {
                        this.utilitiesService.showSuccessToast(success);
                        this.utilitiesService.stopLoader();
                        this.route.navigate([AppRoutes.Customers]);
                    }
                }
            });
        } catch {
            this.utilitiesService.stopLoader();
        } finally {
        }
    }

    save() {
        let documents = this.documentsComponent.form.value;
        if (
            this.form.valid &&
            !this.emailError &&
            !this.contactError &&
            !this.iban_noError
        ) {
            let lengthOfDocuments = 0;
            let form = this.form.value;
            let nationality_id = form.nationality_id.id
                ? form.nationality_id.id
                : form.nationality_id;
            form.nationality_id = nationality_id;
            const addresses = {
                id: form.addressID ? form.addressID : null,
                apartment_no: form.apartment_no,
                street: form.street,
                building_no: form.building_no,
                address: form.address,
                floor: form.floor,
            };
            const bank_details = {
                id: form.bankID ? form.bankID : null,
                overdraft_limit: form.overdraft_limit,
                installment_no_max: form.installment_no_max,
                details: form.details,
                iban_no: form.iban_no,
            };
            form.bank_details = bank_details;
            form.addresses = addresses;
            form.dob = this.utilitiesService.formatDate(form.dob)
            form.issue_date = this.utilitiesService.formatDate(form.issue_date)
            form.expiry_date = this.utilitiesService.formatDate(form.expiry_date)          
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
                
                if (this.id) {
                    this.updateCustomer(form);
                } else {
                    this.saveCustomer(form);
                }
            }
        } else {
            for (const key of Object.keys(this.form.controls)) {
                this.form.controls[key].markAllAsTouched();
            }
        }
    }
}
