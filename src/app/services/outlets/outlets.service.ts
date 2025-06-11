import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SharedService } from '../../services/sharedService';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root',
})
export class OutletsService {
    apiDomain: any;
    constructor(
        private sharedService: SharedService,
        private http: HttpClient,
        private apiService: ApiService
    ) {
        this.apiDomain = this.sharedService.apiDomain;
    }

    getMerchants(limit = 10, offset = 0, search = '', form?) {
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
        return this.apiService.get(
            this.sharedService.merchants,
            params,
            undefined
        );
    }

    getMerchantsDetails(id) {
        return this.apiService.get(
            this.sharedService.merchants + `${id}/`,
            undefined
        );
    }

    assignedStaff(form) {
        return this.apiService.post(
            this.sharedService.assignedStaff,
            form,
            undefined
        );
    }

    addMerchants(form) {
        return this.apiService.post(
            this.sharedService.addMerchants,
            form,
            undefined
        );
    }
    updateMerchants(form, id) {
        return this.apiService.patch(
            this.sharedService.addMerchants + `${id}/`,
            form,
            undefined
        );
    }

    enableOrDisableMerchant(id,form) {
        return this.apiService.post(
            this.sharedService.merchants + `${id}/update_status/`,
            form,
            undefined
        );
    }
}
