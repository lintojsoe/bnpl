import { Component, OnInit } from '@angular/core';
import { FuseAnimations } from '@fuse/animations';
import { AppRoutes } from 'app/AppRoutes';
import { UtilitiesService } from 'app/services/utilitiesService';
import { Crumb } from '../customers/customer.types';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: FuseAnimations,
})
export class DashboardComponent implements OnInit {
    isBank: boolean = true;
    breadcrumbs: Crumb[] = [];
    user: any;
    constructor(private utilitiesService: UtilitiesService) {}

    async ngOnInit(): Promise<void> {
        let users = localStorage.getItem('user');
        this.user = JSON.parse(users);
        this.setBreadcrumbs();
        this.isBank = await this.utilitiesService.isBank();
    }

    setBreadcrumbs() {
        this.breadcrumbs = [
            {
                absolute: true,
                disabled: true,
                path: `${AppRoutes.Dashboard}`,
                relative: false,
                name_en: 'Dashboard',
                name_ar: 'لوحة القيادة',
            },
        ];
    }
}
