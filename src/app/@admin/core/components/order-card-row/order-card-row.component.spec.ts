import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCardRowComponent } from './order-card-row.component';

describe('OrderCardRowComponent', () => {
  let component: OrderCardRowComponent;
  let fixture: ComponentFixture<OrderCardRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderCardRowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderCardRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
