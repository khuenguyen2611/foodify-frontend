import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipperDetailComponent } from './shipper-detail.component';

describe('ShipperDetailComponent', () => {
  let component: ShipperDetailComponent;
  let fixture: ComponentFixture<ShipperDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipperDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipperDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
