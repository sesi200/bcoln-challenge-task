import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySellingComponent } from './my-selling.component';

describe('MySellingComponent', () => {
  let component: MySellingComponent;
  let fixture: ComponentFixture<MySellingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySellingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySellingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
