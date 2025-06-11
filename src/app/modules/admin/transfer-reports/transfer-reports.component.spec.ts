import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferReportsComponent } from './transfer-reports.component';

describe('TransferReportsComponent', () => {
  let component: TransferReportsComponent;
  let fixture: ComponentFixture<TransferReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
