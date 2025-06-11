import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SharedService } from '../../services/sharedService';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    apiDomain: any;
    constructor(
        private sharedService: SharedService,
        private http: HttpClient,
        private apiService: ApiService
    ) {
        this.apiDomain = this.sharedService.apiDomain;
    }

    getDashboard(payoutYear, contractYear) {
        let params = new HttpParams();
        if (payoutYear) {
            params = params.set('payout_year', payoutYear);
        }
        if (contractYear) {
            params = params.set('contract_year', contractYear);
        }

        return this.apiService.get(
            this.sharedService.dashboard,
            params,
            undefined
        );
    }
}
