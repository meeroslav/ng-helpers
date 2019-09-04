import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FragmentComponent } from './fragment.component';

@Component({
  selector: 'lib-parent',
  template: '<lib-child [text]="text"></lib-child>'
})
class ParentComponent {
  text = 'Some text';
}

@Component({
  selector: 'lib-child',
  template: '<ng-template><div>{{ text }}</div></ng-template>'
})
class ChildComponent extends FragmentComponent implements OnInit {
  @Input() text: string;

  constructor(vcRef: ViewContainerRef) {
    super(vcRef);
  }
  ngOnInit() {
    this.appendDOM();
  }
}

describe('NgHelpersComponent', () => {
  let component: ParentComponent;
  let fixture: ComponentFixture<ParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildComponent, ParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create without error', () => {
    expect(component).toBeTruthy();
  });
  it('should inject content of "lib-fragment" template directly to parent\' dom', () => {
    expect(fixture.nativeElement).toBeTruthy();
    expect(fixture.nativeElement.children.length).toBe(2);
    expect(fixture.nativeElement.children[1].nodeName).toBe('DIV');
  });
  it('should preserve input bindings in the injected DOM', () => {
    console.log(fixture.nativeElement.children);
    expect(fixture.nativeElement.children[1].innerText).toBe('Some text');
    component.text = 'Some other text';
    fixture.detectChanges();
    expect(fixture.nativeElement.children[1].innerText).toBe('Some other text');
  });
});
