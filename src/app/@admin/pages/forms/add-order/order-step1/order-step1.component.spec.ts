import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStep1ComponentComponent } from './order-step1-component.component';

describe('OrderStep1ComponentComponent', () => {
  let component: OrderStep1ComponentComponent;
  let fixture: ComponentFixture<OrderStep1ComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStep1ComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderStep1ComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
