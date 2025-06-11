import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-add-business-category',
    templateUrl: './add-business-category.component.html',
    styleUrls: ['./add-business-category.component.scss'],
})
export class AddBusinessCategoryComponent implements OnInit {
    form: FormGroup;
    categoryObject: any = '';
    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddBusinessCategoryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.categoryObject = data ? (data.row ? data.row : null) : null;
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [this.categoryObject ? this.categoryObject.name : null],
            name_ar: [this.categoryObject ? this.categoryObject.name_ar : null],
            name_en: [
                this.categoryObject ? this.categoryObject.name_en : null,
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
