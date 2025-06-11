import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankNamesComponent } from './add-bank-names.component';

describe('AddBankNamesComponent', () => {
  let component: AddBankNamesComponent;
  let fixture: ComponentFixture<AddBankNamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBankNamesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBankNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
