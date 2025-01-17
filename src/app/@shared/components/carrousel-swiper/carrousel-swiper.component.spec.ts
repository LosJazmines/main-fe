import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrouselSwiperComponent } from './carrousel-swiper.component';

describe('CarrouselSwiperComponent', () => {
  let component: CarrouselSwiperComponent;
  let fixture: ComponentFixture<CarrouselSwiperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrouselSwiperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarrouselSwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
