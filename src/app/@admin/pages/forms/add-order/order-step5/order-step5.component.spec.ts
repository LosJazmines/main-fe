import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStep5Component } from './order-step5.component';

describe('OrderStep5Component', () => {
  let component: OrderStep5Component;
  let fixture: ComponentFixture<OrderStep5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStep5Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderStep5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
