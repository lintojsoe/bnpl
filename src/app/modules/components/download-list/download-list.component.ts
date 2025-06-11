import {
    Component,
    ElementRef,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DownalodService } from 'app/services/download.service';
import { UtilitiesService } from 'app/services/utilitiesService';
import * as moment from 'moment';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';

export enum DownloadStatus {
    Initiated = 1,
    InQueue = 2,
    Processing = 3,
    Processed = 4,
    Failed = 5,
    Cancelled = 6,
}

@Component({
    selector: 'app-download-list',
    templateUrl: './download-list.component.html',
    styleUrls: ['./download-list.component.scss'],
})
export class DownloadListComponent implements OnInit {
    @ViewChild('conatiner') private conatiner: ElementRef;
    type: number = 1;
    downloads = [];
    downloadStatus = DownloadStatus
    page = {
        size: 10,
        pageNumber: 0,
    };
    offset = 0;
    isLoading: boolean = false;
    barOptions = {
        barType: 'linear',
        color: '#0e90d2',
        secondColor: '#D3D3D3',
        progress: 66,
        linear: {
            depth: 22,
            stripped: true,
            active: true,
            label: {
                enable: false,
                value: 'Linear Bar',
                color: '#fff',
                fontSize: 10,
                showPercentage: true,
            },
        },
        radial: {
            depth: 3,
            size: 9,
            label: {
                enable: true,
                color: '#09608c',
            },
        },
    };
    count: any;
    constructor(
        private dialog: MatDialog,
        private downloadService: DownalodService,
        private utilitiesService: UtilitiesService,
        public dialogRef: MatDialogRef<DownloadListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.type = data.type;
    }

    ngOnInit(): void {
        this.page.size = 10;
        this.page.pageNumber = 0;
        this.getDownloadsList();
    }
    async getDownloadsList(limit = this.page.size, offset = this.offset) {
        this.isLoading = true;
        try {
            const downloads = await this.downloadService
                .getDownloadsList(limit, offset, this.type)
                .toPromise();
            if (downloads) {
                this.isLoading = false;
                this.count = downloads.count;
                this.downloads = downloads.results;
            }
        } catch {
            this.isLoading = false;
        } finally {
        }
    }

    async loadMore() {
        if (this.downloads.length < this.count) {
            this.offset = this.offset + this.page.size;
            try {
                this.isLoading = true;
                const downloads = await this.downloadService
                    .getDownloadsList(this.page.size, this.offset, this.type)
                    .toPromise();
                if (downloads) {
                    this.isLoading = false;
                    this.count = downloads.count;
                    this.downloads = [
                        ...this.downloads.concat(downloads.results),
                    ];
                }
            } catch {
                this.isLoading = false;
            } finally {
            }
        }
    }

    downloadFn(file) {
        if (file) {
            window.open(file, '_self');
            // return false;
        }
    }

    refresh() {
        this.offset = 0;
        this.getDownloadsList();
    }

    async retry(id) {
        let content = `Are you sure, Do you want to retry ? `;
        let heading = 'Retry';
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
                this.offset = 0;
                this.isLoading = true;
                try {
                    const retry = await this.downloadService
                        .retryDownload(id)
                        .toPromise();
                    if (retry) {
                        this.getDownloadsList();
                    }
                } catch {
                    this.isLoading = false;
                } finally {
                }
            }
        });
    }
    async cancel(id) {
        let content = `Are you sure, Do you want to cancel this download? `;
        let heading = 'Cancel';
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
                this.isLoading = true;
                try {
                    this.offset = 0;
                    const retry = await this.downloadService
                        .cancelDownload(id)
                        .toPromise();
                    if (retry) {
                        this.getDownloadsList();
                    }
                } catch {
                    this.isLoading = false;
                } finally {
                }
            }
        });
    }
    getTime(time) {
        return time ? moment(time).fromNow() : null;
    }
    close() {
        this.dialogRef.close(false);
    }
}
