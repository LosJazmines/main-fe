import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStep4ComponentComponent } from './order-step4-component.component';

describe('OrderStep4ComponentComponent', () => {
  let component: OrderStep4ComponentComponent;
  let fixture: ComponentFixture<OrderStep4ComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStep4ComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderStep4ComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
