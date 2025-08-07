import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { JobDetailSidebarComponent } from './job-detail-sidebar.component';
import { Job } from '../../models/job.model';

describe('JobDetailSidebarComponent', () => {
  let component: JobDetailSidebarComponent;
  let fixture: ComponentFixture<JobDetailSidebarComponent>;

  const job: Job = {
    id: 'JOB-1',
    sku: 'SKU-1',
    status: 'Pending',
    assignedUser: 'John',
    createdDate: new Date(),
    description: 'desc',
    priority: 'high',
    location: 'A',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
      ],
      declarations: [JobDetailSidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JobDetailSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should patch form when job input changes', () => {
    component.job = job;
    component.ngOnInit();
    component.ngOnChanges({ job: { currentValue: job, previousValue: null, firstChange: true, isFirstChange: () => true } as any });
    expect(component.jobForm.value.status).toBe('Pending');
    expect(component.jobForm.value.assignedUser).toBe('John');
  });

  it('should emit close on onClose', () => {
    spyOn(component.close, 'emit');
    component.onClose();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit statusUpdate when submit with valid form and job', () => {
    spyOn(component.statusUpdate, 'emit');
    component.job = job;
    component.ngOnInit();
    component.jobForm.setValue({ status: 'Completed', assignedUser: 'Mary' });
    component.onSubmit();
    expect(component.statusUpdate.emit).toHaveBeenCalledWith({ id: 'JOB-1', status: 'Completed', assignedUser: 'Mary' });
  });

  it('getStatusClass maps values', () => {
    expect(component.getStatusClass('Pending')).toContain('pending');
    expect(component.getStatusClass('In Progress')).toContain('in-progress');
    expect(component.getStatusClass('Completed')).toContain('completed');
  });

  it('formatDate handles undefined', () => {
    expect(component.formatDate(undefined)).toBe('N/A');
  });

  it('getPriorityClass maps values', () => {
    expect(component.getPriorityClass('high')).toContain('danger');
    expect(component.getPriorityClass('medium')).toContain('warning');
    expect(component.getPriorityClass('low')).toContain('success');
  });
});

