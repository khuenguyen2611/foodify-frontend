import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShipperComponent } from './create-shipper.component';

describe('CreateShipperComponent', () => {
  let component: CreateShipperComponent;
  let fixture: ComponentFixture<CreateShipperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateShipperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateShipperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
