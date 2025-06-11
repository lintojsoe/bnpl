import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { TranslateService } from '@ngx-translate/core';
import { AppRoutes } from 'app/AppRoutes';
import { Pagination } from 'app/modules/admin/customers/customer.types';
import { ContractService } from 'app/services/contract/contract.service';
import { TranslationService } from 'app/services/translationService';
import { UtilitiesService } from 'app/services/utilitiesService';
import { Subject } from 'rxjs';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';

@Component({
    selector: 'app-transfer',
    templateUrl: './transfer.component.html',
    styleUrls: ['./transfer.component.scss'],
    animations: FuseAnimations,
})
export class TransferComponent implements OnInit {
    @Input() contractIDs = [];
    @Input() merchantDetails: any = '';
    @Output() goBackHandle: EventEmitter<any> = new EventEmitter<any>();
    files = [];
    today = new Date();
    form: FormGroup;
    constructor(
        private utilitiesService: UtilitiesService,
        private router: Router,
        public translationService: TranslationService,
        private fb: FormBuilder,
        private contractService: ContractService,
        private translateService: TranslateService,
        private dialog: MatDialog
    ) {}

    async ngOnInit(): Promise<void> {
        await this.formInit();
    }

    async formInit() {
        console.log(this.contractIDs);
        this.form = this.fb.group({
            account_holder_name: [
                this.merchantDetails
                    ? this.merchantDetails.account_holder_name
                    : null,
            ],
            bank_name: [
                this.merchantDetails ? this.merchantDetails.bank_name : null,
            ],
            iban_no: [
                this.merchantDetails ? this.merchantDetails.iban_no : null,
            ],
            reference: [null, [Validators.required]],
            transaction_date: [null, [Validators.required]],
            attachment: [null, [Validators.required]],
            contracts: [this.contractIDs],
        });
    }

    ngAfterViewInit(): void {}

    goBack() {
        this.goBackHandle.emit(false);
    }
    uploadFile(files) {
        let reader = this.utilitiesService.convertImageToBase64(files[0]);
        reader.onload = (readerEvt: any) => {
            this.files.push({
                name: files[0].name,
                document: readerEvt.target.result,
                type: files[0].type,
            });
        };
    }
    deleteAttachment() {
        this.files = [];
    }
    async submit() {
        if (this.files.length) {
            this.form.controls.attachment.setValue(this.files[0].document);
        } else {
            this.form.controls.attachment.setValue([]);
        }
        if (this.form.valid) {
            let form = this.form.value;
            form.transaction_date = this.utilitiesService.formatDate(form.transaction_date)    
            try {
                let content = this.translateService.instant(
                    'Are you sure, Do you want to update payout?'
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
                        const transfer = await this.contractService
                            .updatePayoutReport(form, this.merchantDetails.id)
                            .toPromise();
                        if (transfer) {
                            let successmsg = this.translateService.instant(
                                'Payout updated successfully'
                            );
                            this.utilitiesService.showSuccessToast(successmsg);
                            this.utilitiesService.stopLoader();
                            this.goBackHandle.emit(true);
                        }
                    }
                });
            } catch {
            } finally {
            }
        } else {
            if (!this.form.controls.attachment.valid) {
                let error = this.translateService.instant(
                    'Document is mandatory'
                );
                this.utilitiesService.showErrorToast(error);
            }
            for (const key of Object.keys(this.form.controls)) {
                this.form.controls[key].markAllAsTouched();
            }
        }
    }
}
