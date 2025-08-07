import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { JobFilterComponent } from './job-filter.component';
import { JobFilter } from '../../models/job.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

describe('JobFilterComponent', () => {
  let component: JobFilterComponent;
  let fixture: ComponentFixture<JobFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatIconModule,
      ],
      declarations: [JobFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JobFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit filterChange with debounced values', fakeAsync(() => {
    const emitted: JobFilter[] = [];
    component.filterChange.subscribe((f) => emitted.push(f));

    component.filterForm.patchValue({ status: 'Pending', assignedUser: 'John' });
    tick(300);

    expect(emitted.length).toBe(1);
    expect(emitted[0].status).toBe('Pending');
    expect(emitted[0].assignedUser).toBe('John');
    expect(component.hasActiveFilters).toBeTrue();
  }));

  it('should create filter with date values', fakeAsync(() => {
    const emitted: JobFilter[] = [];
    component.filterChange.subscribe((f) => emitted.push(f));

    component.filterForm.patchValue({ startDate: '2024-01-01', endDate: '2024-01-31' });
    tick(300);

    expect(emitted[0].startDate instanceof Date).toBeTrue();
    expect(emitted[0].endDate instanceof Date).toBeTrue();
  }));

  it('clearFilters should reset form and emit empty filter', () => {
    const emitted: JobFilter[] = [];
    component.filterChange.subscribe((f) => emitted.push(f));
    component.clearFilters();
    expect(component.hasActiveFilters).toBeFalse();
    expect(emitted.pop()).toEqual({});
  });
});

