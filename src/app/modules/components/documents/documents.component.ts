import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from 'app/services/customer/customer.service';
import { TranslationService } from 'app/services/translationService';
import { UtilitiesService } from 'app/services/utilitiesService';

@Component({
    selector: 'app-documents',
    templateUrl: './documents.component.html',
    styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit {
    @Input() id: any = '';
    @Input() documents = [];
    @Input() type: any = 'customer';
    @Input() multiple: boolean = false;
    documentTypes = [];
    form: FormGroup;
    constructor(
        public translationService: TranslationService,
        private customerService: CustomerService,
        private utilitiesService: UtilitiesService,
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute
    ) {}

    async ngOnInit(): Promise<void> {
        this.form = this.fb.group({
            documents: this.fb.array([this.addDocFormArray()]),
        });
        await this.getDocumentTypes();
    }
    addDocFormArray(data?) {
        return this.fb.group({
            id: [null],
            document: [null, data ? data.required ? [Validators.required] : '' : ''],
            file_name: [null],
            type: [null],
            name: [data ? data.name : null],
            name_ar: [data ? data.name_ar : null],
            document_type_id: [data ? (data.id ? data.id : null) : null],
            delete_url: [null],
        });
    }
    async getDocumentTypes() {
        try {
            let documentTypes = await this.customerService
                .getDocumentTypes(this.type)
                .toPromise();
            if (documentTypes) {
                console.log(documentTypes);
                this.documentTypes = documentTypes;
                this.form.get('documents')['controls'].splice(0, 1);
                this.documentTypes.forEach((data) => {
                    (this.form.get('documents') as FormArray).push(
                        this.addDocFormArray(data)
                    );
                });
                if (this.id && this.documents.length) {
                    console.log(this.documents);
                    await this.setValues();
                }

                this.utilitiesService.stopLoader();
            }
        } catch {
            this.utilitiesService.stopLoader();
        } finally {
        }
    }

    async setValues() {
        this.documentTypes.forEach((data, index) => {
            this.documents.forEach((items) => {
                if (items.document_type_id == data.id) {
                    (
                        (this.form.get('documents') as FormArray).at(
                            index
                        ) as FormGroup
                    )
                        .get('document')
                        .patchValue(items.document);
                    (
                        (this.form.get('documents') as FormArray).at(
                            index
                        ) as FormGroup
                    )
                        .get('delete_url')
                        .patchValue(items.delete_url);
                    (
                        (this.form.get('documents') as FormArray).at(
                            index
                        ) as FormGroup
                    )
                        .get('id')
                        .patchValue(items.id);
                    (
                        (this.form.get('documents') as FormArray).at(
                            index
                        ) as FormGroup
                    )
                        .get('file_name')
                        .patchValue(`Document - ${index + 1}`);
                    (
                        (this.form.get('documents') as FormArray).at(
                            index
                        ) as FormGroup
                    )
                        .get('type')
                        .patchValue('');
                }
            });
        });
    }

    uploadFile(files, index) {
        let reader = this.utilitiesService.convertImageToBase64(files[0]);
        reader.onload = (readerEvt: any) => {
            ((this.form.get('documents') as FormArray).at(index) as FormGroup)
                .get('document')
                .patchValue(readerEvt.target.result);
            ((this.form.get('documents') as FormArray).at(index) as FormGroup)
                .get('file_name')
                .patchValue(files[0].name);
            ((this.form.get('documents') as FormArray).at(index) as FormGroup)
                .get('type')
                .patchValue(files[0].type);
        };
    }
    removeLocally(index) {
        ((this.form.get('documents') as FormArray).at(index) as FormGroup)
            .get('document')
            .patchValue('');
        ((this.form.get('documents') as FormArray).at(index) as FormGroup)
            .get('id')
            .patchValue('');
    }
    async deleteAttachment(index, url) {
        debugger;
        if (!this.id) {
            this.removeLocally(index);
        } else {
            let id = (
                (this.form.get('documents') as FormArray).at(index) as FormGroup
            ).get('id').value;
            if (!id) {
                this.removeLocally(index);
            } else {
                this.utilitiesService.startLoader();
                this.customerService
                    .deleteAttachment(url)
                    .subscribe(async (data) => {
                        (
                            (this.form.get('documents') as FormArray).at(
                                index
                            ) as FormGroup
                        )
                            .get('document')
                            .patchValue('');
                        (
                            (this.form.get('documents') as FormArray).at(
                                index
                            ) as FormGroup
                        )
                            .get('id')
                            .patchValue('');
                        this.utilitiesService.stopLoader();
                    });
            }
        }
    }
    isImage(fileType) {
        if (!fileType) {
            return;
        }
        let type: string = fileType;
        return type.includes('image');
    }
    viewAttachment(url) {
        window.open(url, '_blank');
    }
}
