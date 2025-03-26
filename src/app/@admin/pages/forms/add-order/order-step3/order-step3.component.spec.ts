import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStep3Component } from './order-step3.component';

describe('OrderStep3Component', () => {
  let component: OrderStep3Component;
  let fixture: ComponentFixture<OrderStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStep3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
