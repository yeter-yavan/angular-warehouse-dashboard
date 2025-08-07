import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { JobCardsComponent } from './job-cards.component';
import { Job } from '../../models/job.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

describe('JobCardsComponent', () => {
  let component: JobCardsComponent;
  let fixture: ComponentFixture<JobCardsComponent>;

  const jobs: Job[] = [
    { id: '1', sku: 'S-1', status: 'Pending', assignedUser: 'A', createdDate: new Date() },
    { id: '2', sku: 'S-2', status: 'In Progress', assignedUser: 'B', createdDate: new Date() }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatProgressSpinnerModule, MatIconModule],
      declarations: [JobCardsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(JobCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render provided jobs count', () => {
    component.jobs = jobs;
    fixture.detectChanges();
    expect(component.jobs.length).toBe(2);
  });

  it('should emit jobSelected when a card is clicked', () => {
    spyOn(component.jobSelected, 'emit');
    component.onCardClick(jobs[0]);
    expect(component.jobSelected.emit).toHaveBeenCalledWith(jobs[0]);
  });

  it('getStatusClass should map statuses to classes', () => {
    expect(component.getStatusClass('Pending')).toContain('pending');
    expect(component.getStatusClass('In Progress')).toContain('in-progress');
    expect(component.getStatusClass('Completed')).toContain('completed');
    expect(component.getStatusClass('Cancelled')).toContain('cancelled');
  });

  it('getStatusIconClass should map statuses to icon classes', () => {
    expect(component.getStatusIconClass('Pending')).toContain('warning');
    expect(component.getStatusIconClass('In Progress')).toContain('primary');
    expect(component.getStatusIconClass('Completed')).toContain('success');
    expect(component.getStatusIconClass('Cancelled')).toContain('danger');
  });

  it('getStatusIcon should map statuses to material icons', () => {
    expect(component.getStatusIcon('Pending')).toBe('schedule');
    expect(component.getStatusIcon('In Progress')).toBe('play_circle');
    expect(component.getStatusIcon('Completed')).toBe('check_circle');
    expect(component.getStatusIcon('Cancelled')).toBe('cancel');
  });

  it('formatDate should include year', () => {
    const text = component.formatDate(new Date('2023-05-01'));
    expect(text).toContain('2023');
  });
});

