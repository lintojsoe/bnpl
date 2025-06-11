export interface CustomerTypes {
    id: 3;
    email?: string;
    contact_no_country?: string;
    created?: string;
    updated?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    contact_no?: string;
    gender?: string;
    dob?: string;
    civil_id?: string;
    issue_date?: string;
    expiry_date?: string;
    active?: boolean;
    verified?: boolean;
    paci?: string;
    verified_at?: any;
    created_by?: string;
    updated_by?: string;
    issued_country?: string;
    user?: string;
}
export interface Crumb {
    path: string;
    absolute: boolean;
    relative: boolean;
    name_en: string;
    name_ar: string;
    translate?: string;
    disabled: boolean;
}
export interface OutletTypes {
    id: number;
    outlet_name?: string;
    outlet_address?: any;
    outlet_reference?: any;
    logo?: any;
}
export interface ContractTypes {
    id: number;
    contract_no?: string;
    customer_name?: string;
    contract_date?: any;
    amount?: number;
    amount_due?: any;
    payment_status?: any;
    contract_status?: any;
    customer_id?: any;
    total?:any
}

export interface InvoiceTypes {
    id: number;
    invoice_number?: string;
    contract_number?: string;
    customer_name?: any;
    amount?: number;
    due_date?: any;
    invoice_status?: any;
}
export interface TransferReports {
    id: number;
    transaction_id?: number;
    bank_name?: string;
    iban_number?: any;
    account_name?: any;
    transaction_date?: any;
    amount?: any;
    attachments?: any;
}

export interface Pagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

