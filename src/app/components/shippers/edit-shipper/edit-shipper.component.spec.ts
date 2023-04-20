import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShipperComponent } from './edit-shipper.component';

describe('EditShipperComponent', () => {
  let component: EditShipperComponent;
  let fixture: ComponentFixture<EditShipperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditShipperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditShipperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
