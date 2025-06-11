import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SharedService } from '../../services/sharedService';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root',
})
export class CustomerService {
    apiDomain: any;
    constructor(
        private sharedService: SharedService,
        private http: HttpClient,
        private apiService: ApiService
    ) {
        this.apiDomain = this.sharedService.apiDomain;
    }
    getCustomers(
        limit = 10,
        offset = 0,
        search = '',
        form?,
        searchName = '',
        isDownload = false
    ) {
        let url = this.sharedService.customers;
        let params = new HttpParams();
        params = params
            .set('limit', limit.toString())
            .set('offset', offset.toString())
            .set('search', search)
            .set('name', searchName);
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

    getCustomerDetails(id) {
        return this.apiService.get(
            this.sharedService.customers + `${id}/`,
            undefined
        );
    }

    searchCustomer(contactNo) {
        let params = new HttpParams();
        params = params.set('contact_no', contactNo);
        return this.apiService.get(
            this.sharedService.customerSearch,
            params,
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

    addCustomer(form) {
        return this.apiService.post(
            this.sharedService.addCustomer,
            form,
            undefined
        );
    }
    updateCustomer(form, id) {
        return this.apiService.put(
            this.sharedService.addCustomer + `${id}/`,
            form,
            undefined
        );
    }

    getDocumentTypes(type = 'customer') {
        let params = new HttpParams();
        params = params.set('type', type);
        return this.apiService.get(this.sharedService.documentTypes, params);
    }

    getCountryList() {
        return this.apiService.get(
            this.sharedService.countryList,
            undefined,
            undefined
        );
    }

    deleteAttachment(url) {
        return this.apiService.delete(url, undefined, undefined);
    }
}
