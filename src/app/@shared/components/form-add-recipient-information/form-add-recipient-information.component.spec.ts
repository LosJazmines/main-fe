import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddRecipientInformationComponent } from './form-add-recipient-information.component';

describe('FormAddRecipientInformationComponent', () => {
  let component: FormAddRecipientInformationComponent;
  let fixture: ComponentFixture<FormAddRecipientInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAddRecipientInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormAddRecipientInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
