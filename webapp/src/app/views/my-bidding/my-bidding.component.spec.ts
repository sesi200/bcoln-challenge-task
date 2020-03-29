import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBiddingComponent } from './my-bidding.component';

describe('MyBiddingComponent', () => {
  let component: MyBiddingComponent;
  let fixture: ComponentFixture<MyBiddingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyBiddingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBiddingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
