import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Job, JobStatus } from '../../models/job.model';

@Component({
  selector: 'app-job-detail-sidebar',
  templateUrl: './job-detail-sidebar.component.html'
})
export class JobDetailSidebarComponent implements OnInit, OnChanges {
  @Input() job: Job | null = null;
  @Input() loading = false;
  @Output() close = new EventEmitter<void>();
  @Output() statusUpdate = new EventEmitter<{ id: string; status: JobStatus; assignedUser?: string }>();

  jobForm: FormGroup;
  jobStatuses: JobStatus[] = ['Pending', 'In Progress', 'Completed'];
  updating = false;

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      status: ['', Validators.required],
      assignedUser: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.updateForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['job'] && changes['job'].currentValue) {
      this.updateForm();
    }
  }

  private updateForm(): void {
    if (this.job) {
      this.jobForm.patchValue({
        status: this.job.status,
        assignedUser: this.job.assignedUser
      });
    } else {
      this.jobForm.reset();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.jobForm.valid && this.job) {
      this.updating = true;
      const formValue = this.jobForm.value;
      
      this.statusUpdate.emit({
        id: this.job.id,
        status: formValue.status,
        assignedUser: formValue.assignedUser
      });

      // Reset updating state after a delay to show feedback
      setTimeout(() => {
        this.updating = false;
      }, 1000);
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'in progress':
        return 'status-in-progress';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'bg-secondary-100 text-secondary-700';
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPriorityClass(priority?: string): string {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-danger-100 text-danger-700';
      case 'medium':
        return 'bg-warning-100 text-warning-700';
      case 'low':
        return 'bg-success-100 text-success-700';
      default:
        return 'bg-secondary-100 text-secondary-700';
    }
  }
} 