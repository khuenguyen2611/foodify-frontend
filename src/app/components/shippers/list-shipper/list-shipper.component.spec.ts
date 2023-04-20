import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListShipperComponent } from './list-shipper.component';

describe('ListShipperComponent', () => {
  let component: ListShipperComponent;
  let fixture: ComponentFixture<ListShipperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListShipperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListShipperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
