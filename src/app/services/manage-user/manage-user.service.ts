import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SharedService } from '../../services/sharedService';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root',
})
export class ManageUserService {
    apiDomain: any;
    constructor(
        private sharedService: SharedService,
        private http: HttpClient,
        private apiService: ApiService
    ) {
        this.apiDomain = this.sharedService.apiDomain;
    }

    //bank

    getUsersList(limit = 10, offset = 0, search = '', form?) {
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
        return this.apiService.get(this.sharedService.users, params, undefined);
    }

    getUserDetails(id) {
        return this.apiService.get(
            this.sharedService.users + `${id}/`,
            undefined
        );
    }

    addUser(form) {
        return this.apiService.post(this.sharedService.users, form, undefined);
    }
    updateUser(form, id) {
        return this.apiService.put(
            this.sharedService.users + `${id}/`,
            form,
            undefined
        );
    }

    //merchant

    getUsersListMerchant(limit = 10, offset = 0, search = '', form?) {
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
            this.sharedService.userMechant,
            params,
            undefined
        );
    }

    getUserDetailsMerchant(id) {
        return this.apiService.get(
            this.sharedService.userMechant + `${id}/`,
            undefined
        );
    }

    addUserMerchant(form) {
        return this.apiService.post(
            this.sharedService.userMechant,
            form,
            undefined
        );
    }
    updateUserMerchant(form, id) {
        return this.apiService.put(
            this.sharedService.userMechant + `${id}/`,
            form,
            undefined
        );
    }

    enableOrDisableMerchantUser(id, form) {
        return this.apiService.post(
            this.sharedService.userMechant + `${id}/update_status/`,
            form,
            undefined
        );
    }
    enableOrDisableBankUser(id, form) {
        return this.apiService.post(
            this.sharedService.users + `${id}/update_status/`,
            form,
            undefined
        );
    }
    changePassword(form) {
        return this.apiService.post(
            this.sharedService.changePassword,
            form,
            undefined
        );
    }
    changeProfilePassword(form) {
        return this.apiService.post(
            this.sharedService.changeProfilePassword,
            form,
            undefined
        );
    }
}
