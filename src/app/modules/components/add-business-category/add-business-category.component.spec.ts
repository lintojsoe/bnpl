import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusinessCategoryComponent } from './add-business-category.component';

describe('AddBusinessCategoryComponent', () => {
  let component: AddBusinessCategoryComponent;
  let fixture: ComponentFixture<AddBusinessCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBusinessCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBusinessCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
