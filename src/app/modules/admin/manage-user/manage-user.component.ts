import { Component, OnInit } from '@angular/core';
import { FuseAnimations } from '@fuse/animations';
import { UtilitiesService } from 'app/services/utilitiesService';

@Component({
    selector: 'app-manage-user',
    templateUrl: './manage-user.component.html',
    styleUrls: ['./manage-user.component.scss'],
    animations: FuseAnimations,
})
export class ManageUserComponent implements OnInit {
    isBank = false;
    isOnInit =false
    constructor(private utilitiesService: UtilitiesService) {}

    async ngOnInit(): Promise<void> {
        this.isBank = await this.utilitiesService.isBank();
        this.isOnInit = true
    }
}
