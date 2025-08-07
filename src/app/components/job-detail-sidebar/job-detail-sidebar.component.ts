import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Job, JobStatus } from '../../models/job.model';

@Component({
  selector: 'app-job-detail-sidebar',
  templateUrl: './job-detail-sidebar.component.html',
  styleUrls: ['./job-detail-sidebar.component.css']
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

  getStatusColor(status: string): string {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  getPriorityColor(priority?: string): string {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
} 