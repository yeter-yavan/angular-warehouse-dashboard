import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { JobStatus, JobFilter } from '../../models/job.model';

@Component({
  selector: 'app-job-filter',
  templateUrl: './job-filter.component.html',
  styleUrls: ['./job-filter.component.css']
})
export class JobFilterComponent implements OnInit, OnDestroy {
  @Output() filterChange = new EventEmitter<JobFilter>();

  filterForm: FormGroup;
  jobStatuses: JobStatus[] = ['Pending', 'In Progress', 'Completed'];
  hasActiveFilters = false;

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      status: [''],
      startDate: [''],
      endDate: [''],
      assignedUser: ['']
    });
  }

  ngOnInit(): void {
    // Listen to form changes with debouncing for better performance
    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      const filter: JobFilter = this.createFilterFromForm(value);
      this.hasActiveFilters = this.hasAnyActiveFilters(filter);
      this.filterChange.emit(filter);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createFilterFromForm(value: any): JobFilter {
    const filter: JobFilter = {};

    if (value.status && value.status.trim()) {
      filter.status = value.status;
    }

    if (value.startDate) {
      filter.startDate = new Date(value.startDate);
    }

    if (value.endDate) {
      filter.endDate = new Date(value.endDate);
    }

    if (value.assignedUser && value.assignedUser.trim()) {
      filter.assignedUser = value.assignedUser.trim();
    }

    return filter;
  }

  private hasAnyActiveFilters(filter: JobFilter): boolean {
    return !!(filter.status || filter.startDate || filter.endDate || filter.assignedUser);
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.hasActiveFilters = false;
    this.filterChange.emit({});
  }
} 