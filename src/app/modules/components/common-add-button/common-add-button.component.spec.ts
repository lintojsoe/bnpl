import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonAddButtonComponent } from './common-add-button.component';

describe('CommonAddButtonComponent', () => {
  let component: CommonAddButtonComponent;
  let fixture: ComponentFixture<CommonAddButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonAddButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonAddButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
