import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDisplayerComponent } from './item-displayer.component';

describe('ItemDisplayerComponent', () => {
  let component: ItemDisplayerComponent;
  let fixture: ComponentFixture<ItemDisplayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDisplayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDisplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
