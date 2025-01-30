import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailCardComponent } from './order-detail-card.component';

describe('OrderDetailCardComponent', () => {
  let component: OrderDetailCardComponent;
  let fixture: ComponentFixture<OrderDetailCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
