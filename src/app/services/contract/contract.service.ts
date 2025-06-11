import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SharedService } from '../../services/sharedService';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api.service';
import { stringify } from 'crypto-js/enc-base64';

@Injectable({
    providedIn: 'root',
})
export class ContractService {
    apiDomain: any;
    constructor(
        private sharedService: SharedService,
        private http: HttpClient,
        private apiService: ApiService
    ) {
        this.apiDomain = this.sharedService.apiDomain;
    }

    getContracts(
        limit = 10,
        offset = 0,
        search = '',
        form?,
        customerID?,
        filterMerchant?,
        isMerchant = false,
        merchantID = '',
        isPaid = false
    ) {
        let params = new HttpParams();
        params = params
            .set('limit', limit.toString())
            .set('offset', offset.toString())
            .set('search', search);
        if (customerID) {
            params = params.set('customer_id', customerID);
        }
        if (filterMerchant) {
            params = params.set('account_id', filterMerchant);
        }

        if (isMerchant) {
            params = params
                .set('account_id', merchantID)
                .set('is_paid', `${isPaid}`);
        }
        if (form) {
            for (let key of Object.keys(form)) {
                params = params.set(
                    `${key}`,
                    `${form[key].value ? form[key].value : ''}`
                );
            }
        }
        return this.apiService.get(
            this.sharedService.contracts,
            params,
            undefined
        );
    }

    getProductReport(
        limit = 10,
        offset = 0,
        search = '',
        form?,
        isDownload = false
    ) {
        let params = new HttpParams();
        let url = this.sharedService.productReport;
        params = params
            .set('limit', limit.toString())
            .set('offset', offset.toString())
            .set('search', search);
        if (form) {
            for (let key of Object.keys(form)) {
                params = params.set(
                    `${key}`,
                    `${form[key].value ? form[key].value : ''}`
                );
            }
        }
        if (isDownload) {
            url = `${url}download/`;
        }
        return this.apiService.get(url, params, undefined);
    }

    getSalesReport(
        limit = 10,
        offset = 0,
        search = '',
        form?,
        isDownload = false
    ) {
        let params = new HttpParams();
        let url = this.sharedService.salesReport;
        params = params
            .set('limit', limit.toString())
            .set('offset', offset.toString())
            .set('search', search);
        if (form) {
            for (let key of Object.keys(form)) {
                params = params.set(
                    `${key}`,
                    `${form[key].value ? form[key].value : ''}`
                );
            }
        }
        if (isDownload) {
            url = `${url}download/`;
        }
        return this.apiService.get(url, params, undefined);
    }

    getContractsMerchants(
        limit = 10,
        offset = 0,
        search = '',
        form?,
        customerID?,
        filterMerchant?,
        isMerchant = false,
        merchantID = '',
        isPaid = false,
        isDownload = false
    ) {
        let params = new HttpParams();
        let url = this.sharedService.contractsMerchants;
        params = params
            .set('limit', limit.toString())
            .set('offset', offset.toString())
            .set('search', search);
        if (customerID) {
            params = params.set('customer_id', customerID);
        }
        if (filterMerchant) {
            params = params.set('account_id', filterMerchant);
        }

        if (isMerchant) {
            params = params
                .set('account_id', merchantID)
                .set('is_paid', `${isPaid}`);
        }
        if (form) {
            for (let key of Object.keys(form)) {
                params = params.set(
                    `${key}`,
                    `${form[key].value ? form[key].value : ''}`
                );
            }
        }
        if (isDownload) {
            url = `${url}download/`;
        }
        return this.apiService.get(url, params, undefined);
    }

    getContractDetail(id) {
        return this.apiService.get(
            this.sharedService.contracts + `${id}/`,
            undefined
        );
    }

    sendReminder(form) {
        return this.apiService.post(
            this.sharedService.sendReminder,
            form,
            undefined
        );
    }

    addContract(form) {
        return this.apiService.post(
            this.sharedService.contracts,
            form,
            undefined
        );
    }
    updateContract(form, id) {
        return this.apiService.put(
            this.sharedService.contracts + `${id}/`,
            form,
            undefined
        );
    }
    deleteAttachment(id) {
        return this.apiService.delete(
            this.sharedService.deleteContract + `${id}/`,
            undefined,
            undefined
        );
    }

    getContractsPayments(
        limit = 10,
        offset = 0,
        search = '',
        form?,
        isDownload = false
    ) {
        let url = this.sharedService.contarctPayemnt;
        let params = new HttpParams();
        params = params
            .set('limit', limit.toString())
            .set('offset', offset.toString())
            .set('search', search);
        if (form) {
            for (let key of Object.keys(form)) {
                params = params.set(
                    `${key}`,
                    `${form[key].value ? form[key].value : ''}`
                );
            }
        }
        if (isDownload) {
            url = `${url}download/`;
        }
        return this.apiService.get(url, params, undefined);
    }

    getPayoutReports(
        limit = 10,
        offset = 0,
        search = '',
        form?,
        isDownload = false,
        merchantID = '',
        isPaid = false
    ) {
        let url = this.sharedService.transfer;
        let params = new HttpParams();
        params = params
            .set('limit', limit.toString())
            .set('offset', offset.toString())
            .set('search', search)
            .set('is_paid', `${isPaid}`);
        if (merchantID) {
            params = params.set('account', merchantID);
        }
        if (form) {
            for (let key of Object.keys(form)) {
                params = params.set(
                    `${key}`,
                    `${form[key].value ? form[key].value : ''}`
                );
            }
        }
        if (isDownload) {
            url = `${url}download/`;
        }
        return this.apiService.get(url, params, undefined);
    }

    transferContarcts(form) {
        return this.apiService.post(
            this.sharedService.transfer,
            form,
            undefined
        );
    }

    updatePayoutReport(form, id) {
        return this.apiService.put(
            this.sharedService.transfer + id + '/',
            form,
            undefined
        );
    }
}
