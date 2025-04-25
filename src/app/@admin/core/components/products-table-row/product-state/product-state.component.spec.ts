import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStateComponent } from './product-state.component';

describe('ProductStateComponent', () => {
  let component: ProductStateComponent;
  let fixture: ComponentFixture<ProductStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductStateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
