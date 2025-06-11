import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CKEditorModule } from 'ng2-ckeditor';
import { FuseAlertModule } from '@fuse/components/alert'
import { NgSelectModule } from '@ng-select/ng-select';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSortModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTableModule,
        MatTooltipModule,
        CommonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonToggleModule,
        CKEditorModule,
        FuseAlertModule,
        NgSelectModule,
        InfiniteScrollModule,
        NgxMatSelectSearchModule
    ], 
    exports: [
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSortModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTableModule,
        MatTooltipModule,
        CommonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonToggleModule,
        CKEditorModule,
        FuseAlertModule,
        NgSelectModule,
        InfiniteScrollModule,
        NgxMatSelectSearchModule
    ],
})
export class SharedModule {}
