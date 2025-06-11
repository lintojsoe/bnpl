import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantUserComponent } from './merchant-user.component';

describe('MerchantUserComponent', () => {
  let component: MerchantUserComponent;
  let fixture: ComponentFixture<MerchantUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
