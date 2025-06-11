import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { SharedService } from './sharedService';

@Injectable({
    providedIn: 'root',
})
export class DownalodService {
    apiDomain: any;
    constructor(
        private sharedService: SharedService,
        private http: HttpClient,
        private apiService: ApiService
    ) {
        this.apiDomain = this.sharedService.apiDomain;
    }

    getDownloadsList(limit = 10, offset = 0, type = 1) {
        let params = new HttpParams();
        params = params
            .set('limit', limit.toString())
            .set('offset', offset.toString())
            .set('download_type', type.toString());
        return this.apiService.get(
            this.sharedService.downloadList,
            params,
            undefined
        );
    }
    retryDownload(id) {
        let params = new HttpParams();
        params = params.set('retry', 'true');
        return this.apiService.get(
            this.sharedService.downloadList + `${id}/`,
            params,
            undefined
        );
    }

    cancelDownload(id) {
        let params = new HttpParams();
        params = params.set('cancel', 'true');
        return this.apiService.get(
            this.sharedService.downloadList + `${id}/`,
            params,
            undefined
        );
    }
}
