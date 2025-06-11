import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslationService } from 'app/services/translationService';

@Component({
    selector: 'app-send-reminder',
    templateUrl: './send-reminder.component.html',
    styleUrls: ['./send-reminder.component.scss'],
})
export class SendReminderComponent implements OnInit {
    loading: boolean = false;
    isSMS: boolean = false;
    form: FormGroup;
    ckeConfig = {
        allowedContent: true,
        removeButtons:
            'CreateDiv,BlockQuote,Superscript,Subscript,PasteFromWord,PasteText',
        forcePasteAsPlainText: true,
    };
    constructor(
        public dialogRef: MatDialogRef<SendReminderComponent>,
        private formBuilder: FormBuilder,
        private translationService: TranslationService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        if (data && data.isSMS) {
            this.isSMS = data.isSMS;
        }
    }

    async ngOnInit(): Promise<void> {
        await this.formInitialize();
    }
    async formInitialize() {
        this.form = this.formBuilder.group({
            customer_id: [null],
            body: [null, [Validators.required]],
            subject: [null],
        });
    }
    send() {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        }
    }
    close() {
        this.dialogRef.close(false)
      }
}
