import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { TranslateService } from '@ngx-translate/core';
import { AppRoutes } from 'app/AppRoutes';
import { DownloadTypes } from 'app/downloadTypes';
import { DownloadListComponent } from 'app/modules/components/download-list/download-list.component';
import { SendReminderComponent } from 'app/modules/components/send-reminder/send-reminder.component';
import { Pagination } from 'app/pagination';
import { AuthUSerService } from 'app/services/authUserService';
import { CustomerService } from 'app/services/customer/customer.service';
import { TranslationService } from 'app/services/translationService';
import { UtilitiesService } from 'app/services/utilitiesService';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Crumb, CustomerTypes } from './customer.types';

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.scss'],
    animations: FuseAnimations,
})
export class CustomersComponent implements OnInit {
    customers: CustomerTypes[] = [];
    breadcrumbs: Crumb[] = [];
    page = new Pagination().page;
    count: number = 0;
    columns: string[] = [
        'name',
        'email',
        'mobile',
        'civil_id',
        'nationality',
        'updated',
        'action',
    ];

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    searchKey: string;
    form: FormGroup;

    constructor(
        private route: Router,
        public translationService: TranslationService,
        public utilitiesService: UtilitiesService,
        private dialog: MatDialog,
        private customerService: CustomerService,
        private fb: FormBuilder,
        private translateService: TranslateService,
        public authUserService: AuthUSerService
    ) {}

    async ngOnInit(): Promise<void> {
        this.form = this.fb.group({
            name: [''],
            email: [''],
            contact_no: [''],
            civil_id: [''],
        });
        this.setBreadcrumbs();
        await this.getCustomers();

        this.form.valueChanges
            .pipe(debounceTime(500))
            .subscribe(async (data) => {
                this.page = new Pagination().page;
                await this.getCustomers();
            });
    }
    async getCustomers(
        limit = this.page.pageSize,
        offset = this.page.offset,
        form = this.form.controls
    ) {
        try {
            this.utilitiesService.startLoader();
            let customers = await this.customerService
                .getCustomers(limit, offset, this.searchKey, form)
                .toPromise();
            if (customers) {
                this.page.length = customers.count;
                this.customers = customers.results;
                this.utilitiesService.stopLoader();
            } else {
                this.utilitiesService.stopLoader();
            }
        } catch {
            this.utilitiesService.stopLoader();
        } finally {
        }
    }

    async handlePageEvent(event) {
        this.page.length = event.length;
        this.page.pageSize = event.pageSize;
        this.page.pageIndex = event.pageIndex;
        this.page.offset = this.page.pageIndex * this.page.pageSize;
        await this.getCustomers();
    }

    setBreadcrumbs() {
        this.breadcrumbs = [
            {
                absolute: true,
                disabled: true,
                path: `${AppRoutes.Customers}`,
                relative: false,
                name_en: 'Customers',
                name_ar: 'عملاء',
            },
        ];
    }

    ngAfterViewInit(): void {}
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    addBtnClick() {
        this.route.navigate([`${AppRoutes.Customers}/create`]);
    }
    edit(id) {
        this.route.navigate([`${AppRoutes.Customers}/edit/${id}`]);
    }
    view(id) {
        this.route.navigate([`${AppRoutes.Customers}/view/${id}`]);
    }
    async sendNotification(id) {
        let isMobile = this.utilitiesService.isMobile();
        let size = {
            width: '50vw',
            height: '70vh',
        };
        if (isMobile) {
            size.height = '100%';
            size.width = '100%';
        }
        const dialogRef = this.dialog.open(SendReminderComponent, {
            data: {},
            maxWidth: '',
            width: `${size.width}`,
            height: `${size.height}`,
        });

        dialogRef.afterClosed().subscribe(async (resp) => {
            if (resp) {
                try {
                    resp.customer_id = id;
                    this.utilitiesService.startLoader();
                    let successmsg = this.translateService.instant(
                        'Notification send successfully'
                    );
                    const notification = await this.customerService
                        .sendReminder(resp)
                        .toPromise();
                    if (notification) {
                        this.utilitiesService.stopLoader();
                        this.utilitiesService.showSuccessToast(successmsg);
                    }
                } catch {
                } finally {
                }
            }
        });
    }
    openDownloads() {
        let isMobile = this.utilitiesService.isMobile();
        let size = {
            width: '30%',
            height: '100%',
        };
        if (isMobile) {
            size.height = '100%';
            size.width = '100%';
        }
        const dialogRef = this.dialog.open(DownloadListComponent, {
            data: { type: DownloadTypes.Customer },
            position: { right: '0%', left: '70%' },
            maxWidth: '',
            width: size.width,
            height: size.height,
            panelClass: [!isMobile ? 'mat-dialog-height-transition' : ''],
        });
        dialogRef.afterClosed().subscribe(async (resp) => {
            if (resp) {
            }
        });
    }
    async download() {
        const download = await this.customerService
            .getCustomers(
                9999999,
                0,
                this.searchKey,
                this.form.controls,
                '',
                true
            )
            .toPromise();
    }
}
