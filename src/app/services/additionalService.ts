import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UtilitiesService } from './utilitiesService';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { SharedService } from './sharedService';

@Injectable({
    providedIn: 'root',
})
export class AdditionalService {
    apiDomain: any;
    constructor(
        private _authService: AuthService,
        private utilitiesService: UtilitiesService,
        private apiService: ApiService,
        private sharedService: SharedService
    ) {
        this.apiDomain = this.sharedService.apiDomain;
    }
    getValidateInputs(type, fieldData, fieldType, id) {
        let params = new HttpParams();
        params = params
            .set('type', type)
            .set('field_name', fieldType)
            .set('field_data', fieldData);
        if (id) {
            params = params.set('id', id);
        }
        return this.apiService.get(
            this.sharedService.validateInputs,
            params,
            undefined
        );
    }
}
