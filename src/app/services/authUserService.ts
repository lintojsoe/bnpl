import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UtilitiesService } from './utilitiesService';

@Injectable({
    providedIn: 'root',
})
export class AuthUSerService {
    constructor(
        private _authService: AuthService,
        private utilitiesService: UtilitiesService
    ) {}

    isTokenIsValid() {
        const token = this._authService.accessToken;
        const helper = new JwtHelperService();
        let currentUser = this.utilitiesService.parseLocalStorageUser();
        if (currentUser && token && !helper.isTokenExpired(token)) {
            return true;
        } else {
            return false;
        }
    }

    checkPermission(permissionKeyword) {
        let permissionArray = [];
        let hasPermission = false;
        let permission = localStorage.getItem('permissions')
            ? localStorage.getItem('permissions')
            : '';
        let permissions: any;
        if (permission) {
            permissions = JSON.parse(permission) ? JSON.parse(permission) : [];
            if (permissions) {
                permissionArray = permissions.filter(
                    (per) => per == permissionKeyword
                );
            }
        }
        if (permissionArray.length > 0) {
            hasPermission = true;
        } else {
            hasPermission = false;
        }
        return hasPermission;
    }

    async setPermission(permission) {
        localStorage.setItem('permissions', JSON.stringify(permission));
        console.log(permission)
    }
}
