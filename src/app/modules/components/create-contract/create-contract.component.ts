import { Component, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
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
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from 'app/services/customer/customer.service';
import moment from 'moment';
import { ContractService } from 'app/services/contract/contract.service';
import { debounceTime } from 'rxjs/operators';
import { ValidateInputs } from 'app/inputValidation';

@Component({
    selector: 'app-create-contract',
    templateUrl: './create-contract.component.html',
    styleUrls: ['./create-contract.component.scss'],
    animations: FuseAnimations,
})
export class CreateContractComponent implements OnInit {
    discount: FormControl;
    breadcrumbs: Crumb[] = [];
    id: any = '';
    isLoading: boolean = false;
    customerDetails: any;
    submit = false;
    form: FormGroup;
    installments = [];
    contractDetails: any;
    files = [];
    overDraftLimit: any = 0;
    limitExceed: boolean = false;
    isLoadingRef: boolean = false;
    isSuccess: boolean = false;
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
        private contractService: ContractService,
        private validateInputs: ValidateInputs
    ) {
        this.activatedRoute.params.subscribe((data) => {
            console.log(data['id']);
            this.id = data['id'];
        });
    }

    get getDiscount() {
        return this.form.controls.discount.value
    }

    ngOnInit(): void {
        if (this.id) {
            this.utilitiesService.startLoader();
        }
        this.formInit();
        this.setBreadcrumbs();
        if (this.id) {
            this.getContractDetails();
        }
    }
    formInit() {
        this.form = this.fb.group({
            notes: [this.contractDetails ? this.contractDetails.notes : null],
            discount: [
                this.contractDetails ? this.contractDetails.discount : 0,
            ],
            payment_comments: [
                this.contractDetails
                    ? this.contractDetails.payment_comments
                    : null,
            ],
            installment_no: [
                this.contractDetails ? this.contractDetails.installment_no : 3,
            ],
            sub_total: [0],
            total: [0],
            documents: [],
            contact_no: ['', [Validators.required]],
            customer_id: [null, [Validators.required]],
            items: this.fb.array([this.addItemsArray()]),
        });

        this.form.controls.contact_no.valueChanges
            .pipe(debounceTime(400))
            .subscribe((data) => {
                if (!data) {
                    this.clearSearchResults();
                }
            });
    }
    async getContractDetails() {
        try {
            let contractDetails = await this.contractService
                .getContractDetail(this.id)
                .toPromise();
            if (contractDetails) {
                this.contractDetails = contractDetails;
                this.formInit();
                (this.form.get('items') as FormArray).clear();
                if (this.contractDetails.items.length > 0) {
                    let items = this.contractDetails.items;
                    items.forEach((data, index) => {
                        (this.form.get('items') as FormArray).push(
                            this.addItemsArray(data)
                        );
                        setTimeout(() => {
                            this.calculateTotalPrice(index);
                        });
                    });
                    await this.customerDetailsFn();
                    await this.addDocuments();
                }
            }
        } catch {
        } finally {
        }
    }
    async addDocuments() {
        let documents = this.contractDetails.contract_documents;
        documents.forEach((data) => {
            this.files.push({
                id: data.id,
                document: data.document,
            });
        });
    }
    async customerDetailsFn() {
        this.form.controls.customer_id.setValue(
            this.contractDetails.customer.id
        );
        this.form.controls.contact_no.setValue(
            this.contractDetails.customer.contact_no
        );
        this.addCustomer(this.contractDetails.customer);
        this.utilitiesService.stopLoader();
    }
    addItemsArray(data?) {
        return this.fb.group({
            id: [data ? data.id : null],
            product_id: [null],
            product_name: [
                data ? data.product_name : null,
                [Validators.required],
            ],
            description: [data ? data.description : null],
            quantity: [data ? data.quantity : 1],
            unit_price: [data ? data.unit_price : 0, [Validators.required]],
            price: [0.0],
        });
    }
    addBtnClick() {
        (this.form.get('items') as FormArray).push(this.addItemsArray());
    }

    setBreadcrumbs() {
        this.breadcrumbs = [
            {
                absolute: true,
                disabled: false,
                path: `${AppRoutes.Contract}`,
                relative: false,
                name_en: 'Contract',
                name_ar: 'اتفافية',
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
    async saveNext() {
        let invlidData = [];
        this.submit = true;
        if ((this.form.get('items') as FormArray).length <= 0) {
            let error = this.translateService.instant(
                'Please add atleast one items'
            );
            this.utilitiesService.showErrorToast(error);
        } else {
            (this.form.get('items') as FormArray).controls.forEach(
                (data, index) => {
                    if (data.invalid) {
                        invlidData.push(index);
                    }
                }
            );
            invlidData.forEach((data) => {
                setTimeout(() => {
                    (this.form.get('items') as FormArray)
                        .at(data)
                        .get('unit_price')
                        .markAsTouched();
                    (this.form.get('items') as FormArray)
                        .at(data)
                        .get('product_name')
                        .markAsTouched();
                }, 0);
            });
            if (this.form.controls.customer_id.valid) {
                if (
                    this.form.valid &&
                    (this.form.get('items') as FormArray).valid &&
                    this.getDiscount <= 100
                ) {
                    try {
                        let headings = this.id
                            ? 'Update Contract'
                            : 'Save Contract';
                        let message = this.id
                            ? 'Are you sure, Do you want to update this contract ?'
                            : 'Are you sure, Do you want to save this contract ?';
                        let content = this.translateService.instant(message);
                        let heading = this.translateService.instant(headings);
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
                                this.utilitiesService.startLoader();
                                (
                                    this.form.get('items') as FormArray
                                ).controls.forEach((data, index) => {
                                    let values = data.value;
                                    if (!values.id) {
                                        delete values.id;
                                    }
                                    values.product_id = index + 1;
                                    console.log(values);
                                });
                                let form = this.form.value;
                                form.documents = this.files;
                                form.documents.forEach((data) => {
                                    if (!data.id) {
                                        delete data.id;
                                    }
                                });
                                delete form.total
                                if (!this.id) {
                                    this.contractService
                                        .addContract(form)
                                        .subscribe((data) => {
                                            let msg =
                                                this.translateService.instant(
                                                    'Contract created successfully'
                                                );
                                            this.utilitiesService.showSuccessToast(
                                                msg
                                            );
                                            this.isSuccess = true;
                                            this.utilitiesService.stopLoader();
                                        });
                                } else {
                                    this.contractService
                                        .updateContract(form, this.id)
                                        .subscribe((data) => {
                                            let msg =
                                                this.translateService.instant(
                                                    'Contract updated successfully'
                                                );
                                            this.utilitiesService.showSuccessToast(
                                                msg
                                            );
                                            this.isSuccess = true;
                                            this.utilitiesService.stopLoader();
                                        });
                                }
                            }
                        });
                    } catch {
                    } finally {
                        this.utilitiesService.stopLoader();
                    }
                } else {
                    for (const key of Object.keys(this.form.controls)) {
                        this.form.controls[key].markAllAsTouched();
                    }
                    if (this.getDiscount > 100) {
                        this.showDiscountError();
                    } else {
                        let error =
                            this.translateService.instant('Form is not valid');
                        this.utilitiesService.showErrorToast(error);
                    }
                }
            } else {
                let error = this.translateService.instant(
                    'Can not find any customer, Please add a customer'
                );
                this.utilitiesService.showErrorToast(error);
            }
        }
    }

    async searchCustomer() {
        this.isLoading = true;
        let searchKey = this.form.controls.contact_no.value;
        if (searchKey) {
            try {
                let customers = await this.customerService
                    .searchCustomer(searchKey)
                    .toPromise();
                if (customers) {
                    this.isLoading = false;
                    this.addCustomer(customers);
                    this.form.controls.customer_id.setValue(customers.id);
                }
            } catch {
                this.isLoading = false;
                this.clearSearchResults();
            } finally {
            }
        } else {
            this.clearSearchResults();
        }
    }
    clearSearchResults() {
        this.customerDetails = '';
        this.limitExceed = false;
        this.overDraftLimit = 0;
        this.form.controls.customer_id.setValue('');
    }
    addCustomer(event) {
        this.customerDetails = event;
        this.form.controls.installment_no.setValue(
            this.customerDetails
                ? this.customerDetails.bank_details
                    ? this.customerDetails.bank_details.installment_no_max
                        ? this.customerDetails.bank_details.installment_no_max
                        : 0
                    : 0
                : 0
        );
        if (event.available_limit) {
            this.overDraftLimit = event.available_limit;
            if (this.overDraftLimit <= 0) {
                this.limitExceed = true;
                let error = this.translateService.instant(
                    'This customer does not have enough overdraft'
                );
                this.utilitiesService.showErrorToast(error);
            } else {
                this.limitExceed = false;
            }
        }
    }
    goBack() {
        this._location.back();
    }

    backToContract() {
        this.route.navigate([AppRoutes.Contract]);
    }
    async calculateTotalPrice(index) {
        let quantity = (
            (this.form.get('items') as FormArray).at(index) as FormGroup
        ).get('quantity').value;
        let unitPrice = (
            (this.form.get('items') as FormArray).at(index) as FormGroup
        ).get('unit_price').value;

        let totalPrice: any = +quantity * +unitPrice;
        totalPrice = totalPrice.toFixed(3);
        ((this.form.get('items') as FormArray).at(index) as FormGroup)
            .get('price')
            .patchValue(totalPrice ? totalPrice : 0);

        await this.calculateSubTotal();
    }
    async calculateSubTotal() {
        let subTotal = 0;
        if ((this.form.get('items') as FormArray).length > 0) {
            (this.form.get('items') as FormArray).controls.forEach((data) => {
                let total = parseFloat(data.value.price);
                subTotal = subTotal + total;
                this.form.controls.sub_total.setValue(subTotal ? subTotal : 0);
            });
        } else {
            this.form.controls.sub_total.setValue(0);
        }

        await this.calculateOverallTotal();
    }
    showDiscountError() {
        let error = this.translateService.instant(
            'Discount should be less than or equal to 100%'
        );
        this.utilitiesService.showErrorToast(error);
    }
    async calculateOverallTotal() {
        console.log(this.overDraftLimit)
        let discount = this.getDiscount
        if (discount > 100) {
            discount = 0;
            this.showDiscountError();
        }
        let sub_total = this.form.get('sub_total').value;
        let total = sub_total - (discount * sub_total / 100);
        if (total > 0) {
            this.form.get('total').setValue(total);
        } else {
            this.form.get('total').setValue(0);
        }
        if (total > this.overDraftLimit) {
            if (this.customerDetails) {
                this.limitExceed = true;
                let error = this.translateService.instant(
                    'This customer does not have enough overdraft'
                );
                this.utilitiesService.showErrorToast(error);
            } else {
                let error = this.translateService.instant(
                    'Please choose a customer'
                );
                this.utilitiesService.showErrorToast(error);
            }
        } else {
            this.limitExceed = false;
        }
    }
    async deleteItem(index) {
        (this.form.get('items') as FormArray).removeAt(index);
        this.calculateSubTotal();
    }

    uploadFile(files, type) {
        let reader = this.utilitiesService.convertImageToBase64(files[0]);
        reader.onload = (readerEvt: any) => {
            this.files.push({
                id: null,
                document: readerEvt.target.result,
            });
        };
    }

    async removeAttachment(index) {
        if (this.files[index].id) {
            let id = this.files[index].id;
            this.contractService.deleteAttachment(id).subscribe((data) => {
                this.files.splice(index, 1);
            });
        } else {
            this.files.splice(index, 1);
        }
    }
}
