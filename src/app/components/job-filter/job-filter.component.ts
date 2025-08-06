import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JobStatus, JobFilter } from '../../models/job.model';

@Component({
  selector: 'app-job-filter',
  templateUrl: './job-filter.component.html',
  styleUrls: ['./job-filter.component.css']
})
export class JobFilterComponent {
  @Output() filterChange = new EventEmitter<JobFilter>();

  filterForm: FormGroup;
  jobStatuses: JobStatus[] = ['Pending', 'In Progress', 'Completed'];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      status: [''],
      startDate: [''],
      endDate: [''],
      assignedUser: ['']
    });

    // Listen to form changes and emit filter updates
    this.filterForm.valueChanges.subscribe(value => {
      const filter: JobFilter = {
        status: value.status || undefined,
        startDate: value.startDate ? new Date(value.startDate) : undefined,
        endDate: value.endDate ? new Date(value.endDate) : undefined,
        assignedUser: value.assignedUser || undefined
      };
      this.filterChange.emit(filter);
    });
  }

  clearFilters(): void {
    this.filterForm.reset();
  }
} 