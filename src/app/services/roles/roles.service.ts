import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SharedService } from '../../services/sharedService';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root',
})
export class RolesService {
    apiDomain: any;
    constructor(
        private sharedService: SharedService,
        private http: HttpClient,
        private apiService: ApiService
    ) {
        this.apiDomain = this.sharedService.apiDomain;
    }

    //bank

    getRoles(search = '', form?) {
        let params = new HttpParams();
        params = params.set('search', search);
        if (form) {
            for (let key of Object.keys(form)) {
                params = params.set(
                    `${key}`,
                    `${form[key].value ? form[key].value : ''}`
                );
            }
        }
        return this.apiService.get(this.sharedService.roles, params, undefined);
    }
    getAllPermissions() {
        return this.apiService.get(
            this.sharedService.allPermission,
            undefined,
            undefined
        );
    }
    addRole(form) {
        return this.apiService.post(this.sharedService.roles, form, undefined);
    }
    updateRole(form, id) {
        return this.apiService.put(
            this.sharedService.roles + `${id}/`,
            form,
            undefined
        );
    }
    getRolesDetails(id) {
        return this.apiService.get(
            this.sharedService.roles + `${id}/`,
            undefined,
            undefined
        );
    }

    refreshPermission() {
        return this.apiService.get(
            this.sharedService.refreshPermission,
            undefined,
            undefined
        );
    }
}
