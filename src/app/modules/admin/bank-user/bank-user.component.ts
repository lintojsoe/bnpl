import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { TranslateService } from '@ngx-translate/core';
import { AppRoutes } from 'app/AppRoutes';
import { ManageUserService } from 'app/services/manage-user/manage-user.service';
import { AlertModalComponent } from 'app/modules/components/alert-modal/alert-modal.component';
import { TranslationService } from 'app/services/translationService';
import { UtilitiesService } from 'app/services/utilitiesService';
import { Subject } from 'rxjs';
import { Crumb } from '../customers/customer.types';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AuthUSerService } from 'app/services/authUserService';
import { ChangeUserPasswordComponent } from 'app/modules/components/change-user-password/change-user-password.component';
import { RolesService } from 'app/services/roles/roles.service';
import { Pagination } from 'app/pagination';

@Component({
    selector: 'app-bank-user',
    templateUrl: './bank-user.component.html',
    styleUrls: ['./bank-user.component.scss'],
    animations: FuseAnimations,
})
export class BankUserComponent implements OnInit {
    users: any[] = [];
    breadcrumbs: Crumb[] = [];
    page = new Pagination().page;
    productsCount: number = 0;
    productsTableColumns: string[] = [
        'name',
        'email',
        'contact_no',
        'role',
        'action',
    ];
    form: FormGroup;
    roles =[]

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private route: Router,
        public translationService: TranslationService,
        public  utilitiesService: UtilitiesService,
        private dialog: MatDialog,
        private translateService: TranslateService,
        private userService: ManageUserService,
        private fb: FormBuilder,
        public authUserService: AuthUSerService,
        private roleService:RolesService
    ) {}

    async ngOnInit(): Promise<void> {
        this.form = this.fb.group({
            name: [''],
            email: [''],
            contact_no: [''],
            civil_id: [''],
            role_id: [''],
        });
        this.setBreadcrumbs();
        let isBank = await this.utilitiesService.isBank();
        if (isBank) {
            await this.getRoles()
            await this.getUsersList();
        }
        this.form.valueChanges
            .pipe(debounceTime(500))
            .subscribe(async (data) => {
                this.page = new Pagination().page;
                await this.getUsersList();
            });
    }
    async getRoles() {
        this.utilitiesService.startLoader()
        try {
            const roles =  await this.roleService.getRoles().toPromise()
            if (roles) {
                this.roles = roles
            }
         }
        catch { }
        finally{}
    }

    async getUsersList(
        limit = this.page.pageSize,
        offset = this.page.offset,
        form = this.form.controls
    ) {
        try {
            this.utilitiesService.startLoader();
            const users = await this.userService
                .getUsersList(limit, offset, '', form)
                .toPromise();
            if (users) {
                this.users = users.results;
                this.page.length = users.count;
                this.utilitiesService.stopLoader();
            }
        } catch {
        } finally {
        }
    }

    setBreadcrumbs() {
        this.breadcrumbs = [
            {
                absolute: true,
                disabled: true,
                path: `${AppRoutes.ManageUser}`,
                relative: false,
                name_en: 'Manage User',
                name_ar: 'إدارة المستخدم',
            },
        ];
    }

    ngAfterViewInit(): void {}
    async handlePageEvent(event) {
        this.page.length = event.length;
        this.page.pageSize = event.pageSize;
        this.page.pageIndex = event.pageIndex;
        this.page.offset = this.page.pageIndex * this.page.pageSize;
        await this.getUsersList();
    }

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
        this.route.navigate([`${AppRoutes.ManageUser}/create`]);
    }
    edit(id) {
        this.route.navigate([`${AppRoutes.ManageUser}/edit/${id}`]);
    }
    view(id) {
        // this.route.navigate([`${AppRoutes.Customers}/view/${id}`]);
    }

    disableUser(id) {
      try {
          let content = this.translateService.instant(
              'Are you sure, Do you want to disable this user?'
          );
          let heading = this.translateService.instant('Disable');
          let fromApp = false;
          let size = this.utilitiesService.isMobileAlertModal();
          const dialogRef = this.dialog.open(AlertModalComponent, {
              data: { content, heading, fromApp },
              maxWidth: '',
              width: `${size.width}`,
              height: `${size.height}`,
          });
          dialogRef.afterClosed().subscribe(async (resp) => {
              if (resp) {
                  this.utilitiesService.startLoader();
                  try {
                      let form = {
                          is_active: false,
                      };
                      this.userService
                          .enableOrDisableBankUser(id, form)
                          .subscribe((data) => {
                              let successmsg = this.translateService.instant(
                                  'User disabled successfully'
                              );
                              this.utilitiesService.showSuccessToast(
                                  successmsg
                              );
                            this.getUsersList()
                          });
                  } catch {
                  } finally {
                  }
              }
          });
      } catch {
      } finally {
          this.utilitiesService.stopLoader();
      }
  }
  enableUser(id) {
      try {
          let content = this.translateService.instant(
              'Are you sure, Do you want to enable this user?'
          );
          let heading = this.translateService.instant('Enable');
          let fromApp = false;
          let size = this.utilitiesService.isMobileAlertModal();
          const dialogRef = this.dialog.open(AlertModalComponent, {
              data: { content, heading, fromApp },
              maxWidth: '',
              width: `${size.width}`,
              height: `${size.height}`,
          });
          dialogRef.afterClosed().subscribe(async (resp) => {
              if (resp) {
                  this.utilitiesService.startLoader();
                  try {
                      let form = {
                          is_active: true,
                      };
                      this.userService
                          .enableOrDisableBankUser(id, form)
                          .subscribe((data) => {
                              let successmsg = this.translateService.instant(
                                  'User enabled successfully'
                              );
                              this.utilitiesService.showSuccessToast(
                                  successmsg
                              );
                              this.getUsersList()
                          });
                  } catch {
                  } finally {
                  }
              }
          });
      } catch {
      } finally {
          this.utilitiesService.stopLoader();
      }
  }
    changePassword(user, firstName, lastName) {
        let fullname = `${firstName} ${lastName}`
        let isMobile = this.utilitiesService.isMobile();
        let size = {
            width: "50vw",
            height: "50vh",
        };
        if (isMobile) {
            size.height = "100%";
            size.width = "100%";
        }
        const dialogRef = this.dialog.open(ChangeUserPasswordComponent, {
            data: {fullname },
            maxWidth: "",
            width: `${size.width}`,
            height: `${size.height}`,
        });
        dialogRef.afterClosed().subscribe(async (resp) => {
            if (resp) {
                try {
                    let form = resp;
                    form.user = user
                    this.userService.changePassword(form).subscribe(data => {
                        let successmsg = this.translateService.instant(
                            'Password changed successfully'
                        );
                        this.utilitiesService.showSuccessToast(
                            successmsg
                        );
                    })
                } catch {
                } finally {
                }
            }
        });
     }
 
}
