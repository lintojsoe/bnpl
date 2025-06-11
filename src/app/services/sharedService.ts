import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class SharedService {
    public apiDomain: any;
    public Domain: any;

    //contracts

    public contracts: any;
    public sendReminder: any;
    public transfer: any;
    public contractsMerchants: any;
    public contarctPayemnt: any;

    // reports
    public salesReport: any;
    public productReport: any;
    //customers
    public customers: any;
    public addCustomer: any;
    public documentTypes: any;
    public countryList: any;
    public deleteDocuments: any;
    public customerSearch: any;

    //merchants
    public merchants: any;
    public assignedStaff: any;
    public addMerchants: any;

    //users

    public users: any;
    public userMechant: any;

    //document

    public deleteContract: any;

    //dashboard
    public dashboard: any;

    //download

    public downloadList: any;

    //roles

    public roles: any;
    public allPermission: any;
    public refreshPermission: any;

    public changePassword: any;

    public changeProfilePassword: any;

    //validate

    public validateInputs: any;

    //settings

    public bankNames: any;
    public businessCategory: any;

    constructor() {
        this.apiDomain = environment.server_url;
        this.Domain = environment.server_url;

        //contracts
        this.customers = '/api/customer/';
        this.contracts = '/api/contract/';
        this.sendReminder = '/api/customers/send-notification/';
        this.addCustomer = '/api/customer/';
        this.merchants = '/api/accounts/';
        this.assignedStaff = '';
        this.addMerchants = '/api/accounts/';
        this.documentTypes = '/api/document-types/';
        this.countryList = '/api/country/';
        this.deleteDocuments = '/api/customer-document/';
        this.transfer = '/api/contracts/payout-detail/';
        this.contractsMerchants = '/api/staff/contract/';

        this.contarctPayemnt = '/api/contracts/payments/';

        this.customerSearch = '/api/customer/search/';

        //user
        this.users = '/api/staffs/';
        this.userMechant = '/api/account-staffs/';

        //document

        this.deleteContract = '/api/contracts/document/';

        //dashboard

        this.dashboard = '/api/dashboard/';

        // download

        this.downloadList = '/api/downloads/';

        //roles
        this.roles = '/api/role/';
        this.allPermission = '/api/custom-permission/';
        this.refreshPermission = '/api/user/permissions/';

        this.changePassword = '/api/change-password/';
        this.changeProfilePassword = '/api/change-profile-password/';

        //validate

        this.validateInputs = '/api/validate-data/';

        //settings

        this.bankNames = '/api/bank-name/';
        this.businessCategory = '/api/business-category/';

        //report
        this.productReport = '/api/accountstaff/products-report/';
        this.salesReport = '/api/accountstaff/sales-report/';
    }
}
