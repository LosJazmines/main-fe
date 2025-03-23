import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeftSidebarFiltersComponent } from './left-sidebar-filters.component';


describe('LeftSidebarFiltersComponent', () => {
  let component: LeftSidebarFiltersComponent;
  let fixture: ComponentFixture<LeftSidebarFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftSidebarFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftSidebarFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
