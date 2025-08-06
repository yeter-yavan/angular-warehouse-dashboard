import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Job, JobStatus, JobFilter, JobUpdateRequest } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private jobsSubject = new BehaviorSubject<Job[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private selectedJobSubject = new BehaviorSubject<Job | null>(null);

  public jobs$ = this.jobsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public selectedJob$ = this.selectedJobSubject.asObservable();

  private mockJobs: Job[] = [
    {
      id: 'JOB-001',
      sku: 'SKU-12345',
      status: 'Pending',
      assignedUser: 'John Doe',
      createdDate: new Date('2024-01-15'),
      description: 'Inventory count for electronics section',
      priority: 'high',
      location: 'Warehouse A - Section 1',
      estimatedCompletion: new Date('2024-01-20')
    },
    {
      id: 'JOB-002',
      sku: 'SKU-67890',
      status: 'In Progress',
      assignedUser: 'Jane Smith',
      createdDate: new Date('2024-01-14'),
      description: 'Quality check for clothing items',
      priority: 'medium',
      location: 'Warehouse B - Section 3',
      estimatedCompletion: new Date('2024-01-18')
    },
    {
      id: 'JOB-003',
      sku: 'SKU-11111',
      status: 'Completed',
      assignedUser: 'Mike Johnson',
      createdDate: new Date('2024-01-10'),
      description: 'Restocking of kitchen supplies',
      priority: 'low',
      location: 'Warehouse A - Section 2',
      estimatedCompletion: new Date('2024-01-12')
    },
    {
      id: 'JOB-004',
      sku: 'SKU-22222',
      status: 'Pending',
      assignedUser: 'Sarah Wilson',
      createdDate: new Date('2024-01-16'),
      description: 'Sorting and packaging of books',
      priority: 'medium',
      location: 'Warehouse C - Section 1',
      estimatedCompletion: new Date('2024-01-22')
    },
    {
      id: 'JOB-005',
      sku: 'SKU-33333',
      status: 'In Progress',
      assignedUser: 'Tom Brown',
      createdDate: new Date('2024-01-13'),
      description: 'Loading dock organization',
      priority: 'high',
      location: 'Warehouse A - Loading Dock',
      estimatedCompletion: new Date('2024-01-17')
    }
  ];

  constructor() {
    // Initialize with mock data
    this.jobsSubject.next([...this.mockJobs]);
  }

  // Mock REST API for job list
  getJobs(filter?: JobFilter): Observable<Job[]> {
    this.loadingSubject.next(true);
    
    return of(this.mockJobs).pipe(
      delay(800), // Simulate network delay
      map(jobs => this.applyFilters(jobs, filter)),
      tap(() => this.loadingSubject.next(false))
    );
  }

  // Mock GraphQL API for job detail
  getJobById(id: string): Observable<Job> {
    this.loadingSubject.next(true);
    
    const job = this.mockJobs.find(j => j.id === id);
    
    return of(job).pipe(
      delay(500), // Simulate GraphQL query delay
      map(job => {
        if (!job) {
          throw new Error(`Job with ID ${id} not found`);
        }
        return job;
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  // Mock REST API for job status update
  updateJobStatus(request: JobUpdateRequest): Observable<Job> {
    this.loadingSubject.next(true);
    
    const jobIndex = this.mockJobs.findIndex(j => j.id === request.id);
    if (jobIndex === -1) {
      return throwError(() => new Error(`Job with ID ${request.id} not found`));
    }

    // Optimistic update
    const updatedJob = { ...this.mockJobs[jobIndex], status: request.status };
    if (request.assignedUser) {
      updatedJob.assignedUser = request.assignedUser;
    }

    return of(updatedJob).pipe(
      delay(600), // Simulate network delay
      tap(job => {
        // Update the job in the mock data
        this.mockJobs[jobIndex] = job;
        this.jobsSubject.next([...this.mockJobs]);
        
        // Update selected job if it's the same one
        const currentSelected = this.selectedJobSubject.value;
        if (currentSelected && currentSelected.id === job.id) {
          this.selectedJobSubject.next(job);
        }
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  // State management methods
  selectJob(job: Job): void {
    this.selectedJobSubject.next(job);
  }

  clearSelectedJob(): void {
    this.selectedJobSubject.next(null);
  }

  refreshJobs(): void {
    this.getJobs().subscribe(jobs => {
      this.jobsSubject.next(jobs);
    });
  }

  private applyFilters(jobs: Job[], filter?: JobFilter): Job[] {
    if (!filter) return jobs;

    return jobs.filter(job => {
      if (filter.status && job.status !== filter.status) return false;
      if (filter.assignedUser && !job.assignedUser.toLowerCase().includes(filter.assignedUser.toLowerCase())) return false;
      if (filter.startDate && job.createdDate < filter.startDate) return false;
      if (filter.endDate && job.createdDate > filter.endDate) return false;
      return true;
    });
  }
} 