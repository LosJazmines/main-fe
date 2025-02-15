import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardAddComponent } from './product-card-add.component';

describe('ProductCardAddComponent', () => {
  let component: ProductCardAddComponent;
  let fixture: ComponentFixture<ProductCardAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductCardAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
