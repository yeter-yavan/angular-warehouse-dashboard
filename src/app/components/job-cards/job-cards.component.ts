import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Job } from '../../models/job.model';

@Component({
  selector: 'app-job-cards',
  templateUrl: './job-cards.component.html'
})
export class JobCardsComponent {
  @Input() jobs: Job[] = [];
  @Input() loading = false;
  @Output() jobSelected = new EventEmitter<Job>();

  onCardClick(job: Job): void {
    this.jobSelected.emit(job);
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



  getStatusIconClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-warning-600';
      case 'in progress':
        return 'text-primary-600';
      case 'completed':
        return 'text-success-600';
      case 'cancelled':
        return 'text-danger-600';
      default:
        return 'text-secondary-600';
    }
  }

  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'schedule';
      case 'in progress':
        return 'play_circle';
      case 'completed':
        return 'check_circle';
      case 'cancelled':
        return 'cancel';
      default:
        return 'help';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
} 