export enum ContractStatus {
    All = 0,
    Pending = 1,
    Approved = 2,
    Rejected = 3,
    Settled = 4,
}
export enum PaymentStatus {
    Unpaid = 1,
    Paid = 3,
    Cancelled = 7,
}

export class ContractStatuses {
    ContractStatuses = [
        { id: ContractStatus.Pending, name: 'Pending' },
        { id: ContractStatus.Approved, name: 'Approved' },
        { id: ContractStatus.Rejected, name: 'Rejected' },
        { id: ContractStatus.Settled, name: 'Settled' },
    ];
}

export class PaymentStatuses {
    PaymentStatuses = [
        { id: PaymentStatus.Unpaid, name: 'Unpaid' },
        { id: PaymentStatus.Paid, name: 'Paid' },
        { id: PaymentStatus.Cancelled, name: 'Cancelled' },
    ];
}
