import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStep3ComponentComponent } from './order-step3-component.component';

describe('OrderStep3ComponentComponent', () => {
  let component: OrderStep3ComponentComponent;
  let fixture: ComponentFixture<OrderStep3ComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStep3ComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderStep3ComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
