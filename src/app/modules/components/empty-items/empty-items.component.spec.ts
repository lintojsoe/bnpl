import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyItemsComponent } from './empty-items.component';

describe('EmptyItemsComponent', () => {
  let component: EmptyItemsComponent;
  let fixture: ComponentFixture<EmptyItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptyItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
