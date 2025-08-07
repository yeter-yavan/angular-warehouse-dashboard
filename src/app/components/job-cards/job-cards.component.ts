import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Job } from '../../models/job.model';

@Component({
  selector: 'app-job-cards',
  templateUrl: './job-cards.component.html',
  styleUrls: ['./job-cards.component.css']
})
export class JobCardsComponent {
  @Input() jobs: Job[] = [];
  @Input() loading = false;
  @Output() jobSelected = new EventEmitter<Job>();

  onCardClick(job: Job): void {
    this.jobSelected.emit(job);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Pending':
        return 'schedule';
      case 'In Progress':
        return 'play_circle';
      case 'Completed':
        return 'check_circle';
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