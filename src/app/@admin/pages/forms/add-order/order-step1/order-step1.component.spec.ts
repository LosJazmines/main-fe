import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderStep1Component } from './order-step1.component';

describe('OrderStep1Component', () => {
  let component: OrderStep1Component;
  let fixture: ComponentFixture<OrderStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStep1Component],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
