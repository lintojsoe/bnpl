import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-common-add-button',
    templateUrl: './common-add-button.component.html',
    styleUrls: ['./common-add-button.component.scss'],
})
export class CommonAddButtonComponent implements OnInit {
    @Input() bgColor: any = '';
    @Input() disabled:boolean=false
    @Output() addBtnClick: EventEmitter<void> = new EventEmitter<any>();
    constructor() {}

    ngOnInit(): void {}

    add() {
        this.addBtnClick.emit();
    }
}
