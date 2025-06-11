import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutReportsComponent } from './payout-reports.component';

describe('PayoutReportsComponent', () => {
  let component: PayoutReportsComponent;
  let fixture: ComponentFixture<PayoutReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayoutReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
