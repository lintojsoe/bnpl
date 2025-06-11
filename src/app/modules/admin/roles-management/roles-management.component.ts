import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { AppRoutes } from 'app/AppRoutes';
import { Pagination } from 'app/pagination';
import { AuthUSerService } from 'app/services/authUserService';
import { RolesService } from 'app/services/roles/roles.service';
import { TranslationService } from 'app/services/translationService';
import { UtilitiesService } from 'app/services/utilitiesService';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Crumb } from '../customers/customer.types';

@Component({
    selector: 'app-roles-management',
    templateUrl: './roles-management.component.html',
    styleUrls: ['./roles-management.component.scss'],
    animations: FuseAnimations,
})
export class RolesManagementComponent implements OnInit {
    roles = [];
    breadcrumbs: Crumb[] = [];
    page = new Pagination().page;
    productsCount: number = 0;
    productsTableColumns: string[] = ['name', 'created', 'updated','action'];
    form: FormGroup;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    searchKey: string;

    constructor(
        private route: Router,
        public translationService: TranslationService,
        private rolesService: RolesService,
        public utilitiesService: UtilitiesService,
        private fb: FormBuilder,
        public authUserService:AuthUSerService
    ) {}

    async ngOnInit(): Promise<void> {
        this.form = this.fb.group({
            name: [''],
        });
        this.setBreadcrumbs();
        await this.getRoles();
        this.form.valueChanges.pipe(debounceTime(500)).subscribe((data) => {
            this. page = new Pagination().page;
            this.getRoles();
        });
    }
    async getRoles(
        limit = this.page.pageSize,
        offset = this.page.offset,
        form = this.form.controls
    ) {
        try {
            this.utilitiesService.startLoader();
            let roles = await this.rolesService
                .getRoles(this.searchKey, form)
                .toPromise();
            if (roles) {
                this.roles = roles;
                this.utilitiesService.stopLoader();
            } else {
                this.utilitiesService.stopLoader();
            }
        } catch {
            this.utilitiesService.stopLoader();
        } finally {
        }
    }

    async handlePageEvent(event) {
        this.page.length = event.length;
        this.page.pageSize = event.pageSize;
        this.page.pageIndex = event.pageIndex;
        this.page.offset = this.page.pageIndex * this.page.pageSize;
        await this.getRoles();
    }

    setBreadcrumbs() {
        this.breadcrumbs = [
            {
                absolute: true,
                disabled: true,
                path: `${AppRoutes.Merchants}`,
                relative: false,
                name_en: 'Roles & Permissions',
                name_ar: 'التجار',
            },
        ];
    }

    ngAfterViewInit(): void {}

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    addBtnClick() {
        this.route.navigate([`${AppRoutes.Roles}/create`]);
    }
    edit(id) {
        this.route.navigate([`${AppRoutes.Roles}/edit/${id}`]);
    }
}
