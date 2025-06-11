import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-add-bank-names',
    templateUrl: './add-bank-names.component.html',
    styleUrls: ['./add-bank-names.component.scss'],
})
export class AddBankNamesComponent implements OnInit {
    form: FormGroup;
    bankNameObject: any = '';
    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddBankNamesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.bankNameObject = data ? (data.row ? data.row : null) : null;
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [this.bankNameObject ? this.bankNameObject.name : null],
            name_ar: [this.bankNameObject ? this.bankNameObject.name_ar : null],
            name_en: [
                this.bankNameObject ? this.bankNameObject.name_en : null,
                [Validators.required],
            ],
        });
    }

    send() {
        if (this.form.valid) {
            let form = this.form.value;
            form.name = form.name_en;
            this.dialogRef.close(form);
        }
    }
    close() {
        this.dialogRef.close(false);
    }
}
