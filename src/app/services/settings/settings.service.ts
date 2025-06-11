import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SharedService } from '../../services/sharedService';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    apiDomain: any;
    constructor(
        private sharedService: SharedService,
        private http: HttpClient,
        private apiService: ApiService
    ) {
        this.apiDomain = this.sharedService.apiDomain;
    }

    //bank

    getBankNames(limit = 10, offset = 0, search = '', form?) {
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
            this.sharedService.bankNames,
            params,
            undefined
        );
    }

    getBankNameDetails(id) {
        return this.apiService.get(
            this.sharedService.bankNames + `${id}/`,
            undefined
        );
    }

    addBankName(form) {
        return this.apiService.post(
            this.sharedService.bankNames,
            form,
            undefined
        );
    }
    updateBankName(form, id) {
        return this.apiService.put(
            this.sharedService.bankNames + `${id}/`,
            form,
            undefined
        );
    }
    deleteBankName(id) {
        return this.apiService.delete(
            this.sharedService.bankNames + `${id}/`,
            undefined
        );
    }

    //business category

    getBusinessCategory(limit = 10, offset = 0, search = '', form?) {
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
            this.sharedService.businessCategory,
            params,
            undefined
        );
    }

    getBusinessCategoryDetails(id) {
        return this.apiService.get(
            this.sharedService.businessCategory + `${id}/`,
            undefined
        );
    }

    addBusinessCategory(form) {
        return this.apiService.post(
            this.sharedService.businessCategory,
            form,
            undefined
        );
    }
    updateBusinessCategory(form, id) {
        return this.apiService.put(
            this.sharedService.businessCategory + `${id}/`,
            form,
            undefined
        );
    }
    deleteCategory(id) {
        return this.apiService.delete(
            this.sharedService.businessCategory + `${id}/`,
            undefined
        );
    }
}
