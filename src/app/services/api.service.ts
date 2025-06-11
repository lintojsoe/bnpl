import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from './translationService';
import { UtilitiesService } from './utilitiesService';
import { SharedService } from './sharedService';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { AppRoutes } from 'app/AppRoutes';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    BASE_URL = '';
    SERVER_URL = '';

    private headersObject = {};
    token: string;

    constructor(
        private httpClient: HttpClient,
        public utilitiesService: UtilitiesService,
        public translationService: TranslationService,
        private translateService: TranslateService,
        private sharedService: SharedService,
        private ngxService: NgxUiLoaderService,
        private router: Router
    ) {
        this.BASE_URL = environment.server_url;
        // this.headersObject = {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${this.token}`,
        //     "x-api-key": "paydoapps-key-cbe806aa-e93a-4a7e-8484-c0cac8e69cad",
        // };
    }

    public get(
        path: string,
        params: HttpParams = new HttpParams(),
        headersObject: object = {},
        showError = true,
        replacePath = false,
        replaceHeader = false
    ): Observable<any> {
        this.token = localStorage.getItem('access_token');
        this.headersObject = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
        };
        const headers = replaceHeader
            ? new HttpHeaders({
                ...headersObject,
            })
            : new HttpHeaders({
                ...headersObject,
                ...this.headersObject,
            });

        const options = {
            headers,
            params,
        };

        return this.httpClient
            .get(this.BASE_URL + path, options)
            .pipe(
                catchError((response) =>
                    showError
                        ? this.formatErrors(response)
                        : throwError(response)
                )
            );
    }

    public put(
        path: string,
        body: object = {},
        params: HttpParams = new HttpParams(),
        headersObject: object = {},
        showError = true,
        replacePath = false,
        replaceHeader = false
    ): Observable<any> {
        this.token = localStorage.getItem('access_token');
        this.headersObject = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
            // "x-api-key": "paydoapps-key-cbe806aa-e93a-4a7e-8484-c0cac8e69cad",
        };
        const headers = replaceHeader
            ? new HttpHeaders({
                ...headersObject,
            })
            : new HttpHeaders({
                ...headersObject,
                ...this.headersObject,
            });

        const options = {
            headers: headersObject == null ? {} : headers,
            params,
        };

        return this.httpClient
            .put(this.BASE_URL + path, body, options)
            .pipe(
                catchError((response) =>
                    showError
                        ? this.formatErrors(response)
                        : throwError(response)
                )
            );
    }

    public patch(
        path: string,
        body: object = {},
        params: HttpParams = new HttpParams(),
        headersObject: object = {},
        showError = true,
        replacePath = false,
        replaceHeader = false
    ): Observable<any> {
        this.token = localStorage.getItem('access_token');
        this.headersObject = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
            // "x-api-key": "paydoapps-key-cbe806aa-e93a-4a7e-8484-c0cac8e69cad",
        };
        const headers = replaceHeader
            ? new HttpHeaders({
                ...headersObject,
            })
            : new HttpHeaders({
                ...headersObject,
                ...this.headersObject,
            });

        const options = {
            headers,
            params,
        };

        return this.httpClient
            .patch(this.BASE_URL + path, body, options)
            .pipe(
                catchError((response) =>
                    showError
                        ? this.formatErrors(response)
                        : throwError(response)
                )
            );
    }

    public post(
        path: string,
        body: object = {},
        headersObject: object = {},
        showError = true,
        replacePath = false,
        replaceHeader = false
    ): Observable<any> {
        this.token = localStorage.getItem('access_token');
        this.headersObject = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
            // "x-api-key": "paydoapps-key-cbe806aa-e93a-4a7e-8484-c0cac8e69cad",
        };
        const headers = replaceHeader
            ? new HttpHeaders({
                ...headersObject,
            })
            : new HttpHeaders({
                ...headersObject,
                ...this.headersObject,
            });

        const options = {
            headers,
        };

        return this.httpClient
            .post(this.BASE_URL + path, body, options)
            .pipe(
                catchError((response) =>
                    showError
                        ? this.formatErrors(response)
                        : throwError(response)
                )
            );
    }

    public delete(
        path: string,
        headersObject: object = {},
        showError = true,
        replacePath = false,
        replaceHeader = false
    ): Observable<any> {
        this.token = localStorage.getItem('access_token');
        this.headersObject = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
            // "x-api-key": "paydoapps-key-cbe806aa-e93a-4a7e-8484-c0cac8e69cad",
        };
        const headers = replaceHeader
            ? new HttpHeaders({
                ...headersObject,
            })
            : new HttpHeaders({
                ...headersObject,
                ...this.headersObject,
            });

        const options = {
            headers,
        };

        return this.httpClient
            .delete((replacePath ? '' : this.BASE_URL) + path, options)
            .pipe(
                catchError((response) =>
                    showError
                        ? this.formatErrors(response)
                        : throwError(response)
                )
            );
    }

    async formatErrors(errorResponse: any, throwGeneric = false): Promise<Observable<any>> {
        this.ngxService.stop();
        console.log("Error response", errorResponse);
        let message = this.translationService.getTranslatedField(
            errorResponse.error,
            "error"
        );
        if (message == "Invalid request data") {
            message = ""
        }
        if (throwGeneric || !message) {
            this.translateService
                .get("API general error")
                .subscribe((translatedMessage) => {
                    if (JSON.stringify(errorResponse.error)) {
                        this.utilitiesService.showErrorToast(
                            JSON.stringify(errorResponse.error)
                        );
                    } else {
                        this.utilitiesService.showErrorToast(
                            errorResponse.error
                        );
                    }
                });
        } else {
            this.utilitiesService.showErrorToast(message);
        }

        if (errorResponse.status == 403) {
            this.unAuthorized();
        }

        throw throwError(errorResponse);
    }

    unAuthorized() {
        this.router.navigate([AppRoutes.Error]);

    }
}
