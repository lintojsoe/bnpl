import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { ApiService } from 'app/services/api.service';
import { AuthUSerService } from 'app/services/authUserService';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SharedService } from 'app/services';

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private apiService: ApiService,
        private sharedService:SharedService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('access_token', token);
    }

    get accessToken(): string {
        return localStorage.getItem('access_token') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     * 
     */
     forgotPassword(email: string,generate_otp=true): Observable<any> {
        let encodedEmail = encodeURIComponent(email)
        console.log(encodedEmail)
        return this._httpClient.get(`${this.sharedService.apiDomain}/api/staff/forgot-password/?email=${encodedEmail}&generate_otp=${generate_otp}`);
    }

    submitOTPOrPassword(form) {
        return this._httpClient.post(`${this.sharedService.apiDomain}/api/staff/forgot-password/`,form);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */

    setPermissions(permission) {
        localStorage.setItem('permissions', JSON.stringify(permission));
    }
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this.apiService.post('/api/staff/login/', credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                if (response.access_token && response.user.permissions && response.user) {
                    this.accessToken = response.access_token;
                    localStorage.setItem('access_token', this.accessToken);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    this._authenticated = true;
                    this.setPermissions(response.user.permissions);
                    return of(response);
                } else {
                    return of (false)
                }
                
            })
        );

        return this._httpClient.post('api/staff/login/', credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.access_token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        let isExpired: boolean = false;
        let token = localStorage.getItem('access_token');
        if (token) {
            const helper = new JwtHelperService();
            isExpired = helper.isTokenExpired(token);
            if (!isExpired) {
                return of(true);
            } else {
                return of(false);
            }
        } else {
            return of(false);
        }
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }
    }
}
