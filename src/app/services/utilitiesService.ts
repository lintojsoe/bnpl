import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { NgxUiLoaderService } from "ngx-ui-loader";
import { BehaviorSubject } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DownloadTypes } from 'app/downloadTypes';
import { PermissionConstants } from 'app/permissionConstants';
import { FormGroup } from '@angular/forms';
import moment from 'moment';


// import { AlertModalComponent } from "app/main/components/alert-modal/alert-modal.component";

@Injectable({
    providedIn: 'root',
})
export class UtilitiesService {
    public currentUser$: BehaviorSubject<any> = new BehaviorSubject('');
    public formChanged$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public autoSave: BehaviorSubject<number> = new BehaviorSubject(0);
    constructor(
        private _snackBar: MatSnackBar,
        private ngxService: NgxUiLoaderService,
        private breakpointObserver: BreakpointObserver,
        private dialog: MatDialog
    ) { }

    public get getDownloadTypes(): typeof DownloadTypes {
        return DownloadTypes;
    }
    public get Permission(): typeof PermissionConstants {
        return PermissionConstants;
    }
    formChangedOrNot(value: boolean) {
        this.formChanged$.next(value);
    }

    showErrorToast(msg) {
        debugger;
        this._snackBar.open(`${msg}`, 'Error', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error'],
        });
    }
    showSuccessToast(msg) {
        this._snackBar.open(`${msg}`, 'Success', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success'],
        });
    }

    showWarningToast(msg) {
        this._snackBar.open(`${msg}`, 'Warning', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['warning'],
        });
    }
    async checkIfObjectIsEmpty(filterObject) {
        const length = Object.keys(filterObject).length;
        let count = 0;
        for (let key in filterObject) {
            if (!filterObject[key]) {
                count = count + 1;
            }
        }
        if (length == count) {
            return true;
        } else {
            return false;
        }
    }
    convertImageToBase64(image) {
        var reader = new FileReader();
        let file = image;
        reader.readAsDataURL(file);
        return reader;
    }
    async setAuthorizationToken(token: string) {
        if (token) {
            localStorage.setItem('access_token', token);
        }
    }
    async getAuthorizationToken() {
        return localStorage.getItem('access_token');
    }

    startLoader() {
        this.ngxService.start();
    }
    stopLoader() {
        this.ngxService.stop();
    }
    isMobile() {
        let isMobileObser = this.breakpointObserver.observe([
            Breakpoints.XSmall,
            Breakpoints.Small,
        ]);
        let isMobile = false;
        isMobileObser.subscribe((data) => {
            isMobile = data.matches;
        });
        return isMobile;
    }

    isMobileAlertModal() {
        let size = {
            width: '25vw',
            height: '28vh',
        };
        let isMobileObser = this.breakpointObserver.observe([
            Breakpoints.XSmall,
            Breakpoints.Small,
        ]);
        isMobileObser.subscribe((data) => {
            if (data.matches) {
                size.height = '50%';
                size.width = '80%';
            }
        });
        return size;
    }

    checkIfISDCodeExist(contactNumber: string = '') {
        if (contactNumber.startsWith('+')) {
            return true;
        } else {
            return false;
        }
    }

    getYearsList(limit = 100) {
        let yearList = [];
        let date = new Date();
        let year = date.getFullYear();
        for (let i = 0; i <= limit; i++) {
            yearList.push({ year: year - i });
        }
        return yearList;
    }

    async parseLocalStorageUser() {
        const currentUser = localStorage.getItem('user')
            ? localStorage.getItem('user')
            : '';
        let parsedUser = '';
        if (currentUser) {
            parsedUser = JSON.parse(currentUser);
        }
        return parsedUser;
    }

    async isBank() {
        debugger;
        let isBank = true;
        let user: any = await this.parseLocalStorageUser();
        console.log(user);
        if (user.account) {
            isBank = false;
        } else {
            isBank = true;
        }
        return isBank;
    }

    formatDate(date) {
        let formattedDate: any = ""
        if (date) {
            let actualDate = new Date(date)
            console.log(moment(actualDate).format('YYYY/MM/DD'))
            formattedDate = moment(actualDate).format('YYYY/MM/DD')
        }
        return formattedDate
    }
}
