import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRequestsIndicatorComponent } from './pending-requests-indicator.component';

describe('PendingRequestsIndicatorComponent', () => {
  let component: PendingRequestsIndicatorComponent;
  let fixture: ComponentFixture<PendingRequestsIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingRequestsIndicatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PendingRequestsIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
