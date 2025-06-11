import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslationService } from 'app/services/translationService';
import { UtilitiesService } from 'app/services/utilitiesService';
import { DownalodService } from 'app/services/download.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-download-button',
    templateUrl: './download-button.component.html',
    styleUrls: ['./download-button.component.scss'],
})
export class DownloadButtonComponent implements OnInit {
    @Input() type: any = '1';
    @Input() listLength: number = 0;
    @Output()
    openDownloadHandle: EventEmitter<void> = new EventEmitter<any>();

    @Output()
    downloadHandle: EventEmitter<void> = new EventEmitter<any>();
    constructor(
        public translationService: TranslationService,
        private utilitiesService: UtilitiesService,
        private downalodService: DownalodService,
        private translate: TranslateService
    ) {}

  ngOnInit(): void {
      console.log(this.listLength)
    }
    async download() {
        this.utilitiesService.startLoader();
        try {
            const download = await this.downalodService
                .getDownloadsList(10, 0)
                .toPromise();
            if (download) {
                let fullProccessed = true;
                let count = 0;
                let downloadList = download.results;
                if (downloadList.length > 0) {
                    downloadList.forEach((data) => {
                        count = count + 1;
                        if (
                            (data.status == 1 ||
                                data.status == 2 ||
                                data.status == 3) &&
                            data.download_type == +this.type
                        ) {
                            fullProccessed = false;
                        }
                    });
                    if (count == downloadList.length) {
                        this.utilitiesService.stopLoader();
                        let error = this.translate.instant(
                            'You have already pending downloads, So you can not download at this moment. Please try again later'
                        );
                        fullProccessed
                            ? this.callDownload()
                            : this.utilitiesService.showWarningToast(error);
                    }
                } else {
                    this.utilitiesService.stopLoader();
                    this.callDownload();
                }
            }
        } catch {
            this.utilitiesService.stopLoader();
        } finally {
        }
    }
    callDownload() {
        let downloading = this.translate.instant(
            'Download started, Please Check My Downloads'
        );
        this.utilitiesService.showSuccessToast(downloading);
        this.downloadHandle.emit();
    }
    openDownloads() {
        this.openDownloadHandle.emit();
    }
}
