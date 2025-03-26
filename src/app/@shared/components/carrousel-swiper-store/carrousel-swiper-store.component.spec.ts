import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarrouselSwiperStoreComponent } from './carrousel-swiper-store.component';


describe('CarrouselSwiperStoreComponent', () => {
  let component: CarrouselSwiperStoreComponent;
  let fixture: ComponentFixture<CarrouselSwiperStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrouselSwiperStoreComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CarrouselSwiperStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
