import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStep2Component } from './order-step2.component';

describe('OrderStep2ComponentComponent', () => {
  let component: OrderStep2Component;
  let fixture: ComponentFixture<OrderStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStep2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
