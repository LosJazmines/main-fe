import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStep4Component } from './order-step4.component';

describe('OrderStep4ComponentComponent', () => {
  let component: OrderStep4Component;
  let fixture: ComponentFixture<OrderStep4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStep4Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderStep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
