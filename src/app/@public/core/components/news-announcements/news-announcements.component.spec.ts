import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsAnnouncementsComponent } from './news-announcements.component';

describe('NewsAnnouncementsComponent', () => {
  let component: NewsAnnouncementsComponent;
  let fixture: ComponentFixture<NewsAnnouncementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsAnnouncementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewsAnnouncementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
