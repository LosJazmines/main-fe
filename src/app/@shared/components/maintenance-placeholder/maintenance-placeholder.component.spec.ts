import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancePlaceholderComponentComponent } from './maintenance-placeholder-component.component';

describe('MaintenancePlaceholderComponentComponent', () => {
  let component: MaintenancePlaceholderComponentComponent;
  let fixture: ComponentFixture<MaintenancePlaceholderComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenancePlaceholderComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaintenancePlaceholderComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
