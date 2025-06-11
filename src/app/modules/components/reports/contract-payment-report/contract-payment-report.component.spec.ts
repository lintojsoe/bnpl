import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractPaymentReportComponent } from './contract-payment-report.component';

describe('ContractPaymentReportComponent', () => {
  let component: ContractPaymentReportComponent;
  let fixture: ComponentFixture<ContractPaymentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractPaymentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractPaymentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
