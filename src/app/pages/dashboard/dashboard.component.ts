import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { JobService } from '../../services/job.service';
import { Job, JobFilter, JobStatus } from '../../models/job.model';

export type ViewMode = 'table' | 'cards';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  jobs: Job[] = [];
  selectedJob: Job | null = null;
  loading = false;
  sidebarOpen = false;
  currentFilter: JobFilter = {};
  viewMode: ViewMode = 'table';

  private destroy$ = new Subject<void>();

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    // Subscribe to jobs and loading state
    combineLatest([
      this.jobService.jobs$,
      this.jobService.loading$
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([jobs, loading]) => {
      this.jobs = jobs;
      this.loading = loading;
    });

    // Subscribe to selected job
    this.jobService.selectedJob$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(job => {
      this.selectedJob = job;
      this.sidebarOpen = !!job;
    });

    // Load initial data
    this.loadJobs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadJobs(): void {
    this.jobService.getJobs(this.currentFilter).subscribe();
  }

  onFilterChange(filter: JobFilter): void {
    this.currentFilter = filter;
    this.loadJobs();
  }

  onJobSelected(job: Job): void {
    this.jobService.selectJob(job);
  }

  onSidebarClose(): void {
    this.jobService.clearSelectedJob();
  }

  onStatusUpdate(update: { id: string; status: JobStatus; assignedUser?: string }): void {
    this.jobService.updateJobStatus(update).subscribe({
      next: (updatedJob) => {
        console.log('Job updated successfully:', updatedJob);
        // The service will automatically update the state
      },
      error: (error) => {
        console.error('Error updating job:', error);
        // In a real app, you'd show a toast notification here
      }
    });
  }

  refreshJobs(): void {
    this.jobService.refreshJobs();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'table' ? 'cards' : 'table';
  }
} 