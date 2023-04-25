import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScamOrdersComponent } from './scam-orders.component';

describe('ScamOrdersComponent', () => {
  let component: ScamOrdersComponent;
  let fixture: ComponentFixture<ScamOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScamOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScamOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
