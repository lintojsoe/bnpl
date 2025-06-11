import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslationService } from "app/services/translationService";

@Component({
    selector: "app-alert-modal",
    templateUrl: "./alert-modal.component.html",
    styleUrls: ["./alert-modal.component.scss"],
})
export class AlertModalComponent implements OnInit {
    content: any = "";
    heading: any = "";
    fromApp: boolean = false;
    constructor(
        public dialogRef: MatDialogRef<AlertModalComponent>,
        private formBuilder: FormBuilder,
        private translationService: TranslationService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.content = data.content;
        this.heading = data.heading;
        this.fromApp = data.fromApp;
    }

    ngOnInit(): void {}

    yes() {
        this.dialogRef.close(true);
    }
    no() {
        this.dialogRef.close(false);
    }
}
