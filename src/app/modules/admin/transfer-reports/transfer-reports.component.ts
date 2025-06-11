import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { AppRoutes } from 'app/AppRoutes';
import { Pagination } from 'app/pagination';
import { Subject } from 'rxjs';
import { Crumb, TransferReports } from '../customers/customer.types';

@Component({
    selector: 'app-transfer-reports',
    templateUrl: './transfer-reports.component.html',
    styleUrls: ['./transfer-reports.component.scss'],
    animations: FuseAnimations,
})
export class TransferReportsComponent implements OnInit {
    reports: TransferReports[] = [];
    breadcrumbs: Crumb[] = [];
    page = new Pagination().page;
    productsCount: number = 0;
    productsTableColumns: string[] = [
        'transaction_id',
        'bank_name',
        'iban_number',
        'account_name',
        'amount',
        'transaction_date',
        'attachments',
    ];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private route: Router) {}

    ngOnInit(): void {
        this.setBreadcrumbs();
    }

    handlePageEvent(event) {
        this.page.length = event.length;
        this.page.pageSize = event.pageSize;
        this.page.pageIndex = event.pageIndex;
    }
    setBreadcrumbs() {
        this.breadcrumbs = [
            {
                absolute: true,
                disabled: false,
                path: `${AppRoutes.Merchants}`,
                relative: false,
                name_en: 'Merchants',
                name_ar: 'التجار',
            },
            {
                absolute: true,
                disabled: true,
                path: ``,
                relative: false,
                name_en: 'Transfer Report',
                name_ar: 'تقرير النقل',
            },
        ];
    }

    ngAfterViewInit(): void {}

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    selectRow(row, event) {
        this.route.navigate(
            [`${AppRoutes.Merchants}/view-payouts/${row.id}`],
            {
                queryParams: {
                    state: 'reports',
                },
            }
        );
    }
}
