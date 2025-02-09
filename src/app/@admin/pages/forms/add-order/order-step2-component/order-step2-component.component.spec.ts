import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStep2ComponentComponent } from './order-step2-component.component';

describe('OrderStep2ComponentComponent', () => {
  let component: OrderStep2ComponentComponent;
  let fixture: ComponentFixture<OrderStep2ComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStep2ComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderStep2ComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
