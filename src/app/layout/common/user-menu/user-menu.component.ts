import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from 'app/services/utilitiesService';
import { ChangePasswordComponent } from 'app/modules/admin/auth/change-password/change-password.component';
import { ChangeAdminPasswordComponent } from 'app/modules/components/change-admin-password/change-admin-password.component';
import { ManageUserService } from 'app/services/manage-user/manage-user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'user-menu',
    templateUrl: './user-menu.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'userMenu',
})
export class UserMenuComponent implements OnInit, OnDestroy {
    static ngAcceptInputType_showAvatar: BooleanInput;

    @Input() showAvatar: boolean = true;
    user: any;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
        private _authService: AuthService,
        private utilitiesService: UtilitiesService,
        private dialog: MatDialog,
        private userService: ManageUserService,
        private translateService:TranslateService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        let users = localStorage.getItem('user');
        this.user = JSON.parse(users);
        // Subscribe to user changes
        // this._userService.user$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((user: User) => {
        //         this.user = user;
        //         this._changeDetectorRef.markForCheck();
        //     });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the user status
     *
     * @param status
     */
    updateUserStatus(status: string): void {
        // Return if user is not available
        if (!this.user) {
            return;
        }

        // Update the user
        this._userService
            .update({
                ...this.user,
                status,
            })
            .subscribe();
    }

    /**
     * Sign out
     */
    signOut(): void {
        this._authService.signOut();
        this._router.navigate(['/sign-in']);
    }
    changePassword() {
        let fullname = `${this.user.first_name} ${this.user.last_name}`;
        let isMobile = this.utilitiesService.isMobile();
        let size = {
            width: '50vw',
            height: '50vh',
        };
        if (isMobile) {
            size.height = '100%';
            size.width = '100%';
        }
        const dialogRef = this.dialog.open(ChangeAdminPasswordComponent, {
            data: { fullname },
            maxWidth: '',
            width: `${size.width}`,
            height: `${size.height}`,
        });
        dialogRef.afterClosed().subscribe(async (resp) => {
            if (resp) {
                try {
                    let form = resp;
                    this.userService.changeProfilePassword(form).subscribe((data) => {
                        let successmsg = this.translateService.instant(
                            'Password changed successfully'
                        );
                        this.utilitiesService.showSuccessToast(successmsg);
                    });
                } catch {
                } finally {
                }
            }
        });
    }
}
