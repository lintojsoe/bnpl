import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { InvoiceTypes, Pagination } from '../customers/customer.types';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
    invoices: InvoiceTypes[] = [];

    pagination: Pagination;
    productsCount: number = 0;
    productsTableColumns: string[] = [
        'invoice_number',
        'contract_number',
        'customer_name',
        'amount',
        'invoice_status',
        'due_date',
        'action',
    ];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor() {
        this.invoices = [
            {
                id: 1,
                amount: 100,
                contract_number: 'CON001',
                customer_name: 'Linto',
                due_date: '1/may/2020',
                invoice_number: '#INC001',
                invoice_status: 'unpaid',
            },
            {
                id: 2,
                amount: 100,
                contract_number: 'CON001',
                customer_name: 'Linto',
                due_date: '1/may/2020',
                invoice_number: '#INC001',
                invoice_status: 'unpaid',
            },
            {
                id: 3,
                amount: 100,
                contract_number: 'CON001',
                customer_name: 'Linto',
                due_date: '1/may/2020',
                invoice_number: '#INC001',
                invoice_status: 'unpaid',
            },
            {
                id: 4,
                amount: 100,
                contract_number: 'CON001',
                customer_name: 'Linto',
                due_date: '1/may/2020',
                invoice_number: '#INC001',
                invoice_status: 'unpaid',
            },
            {
                id: 5,
                amount: 100,
                contract_number: 'CON001',
                customer_name: 'Linto',
                due_date: '1/may/2020',
                invoice_number: '#INC001',
                invoice_status: 'unpaid',
            },
        ];
    }

    ngOnInit(): void {
        this.pagination.length = 5;
        this.pagination.size = 5;
        this.pagination.page = 1;
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
}
