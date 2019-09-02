import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgHelpersComponent } from './ng-helpers.component';

describe('NgHelpersComponent', () => {
  let component: NgHelpersComponent;
  let fixture: ComponentFixture<NgHelpersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgHelpersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgHelpersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
