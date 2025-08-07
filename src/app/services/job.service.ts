import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, tap, catchError } from 'rxjs/operators';
import { Job, JobStatus, JobFilter, JobUpdateRequest } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private jobsSubject = new BehaviorSubject<Job[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private selectedJobSubject = new BehaviorSubject<Job | null>(null);
  private currentFilterSubject = new BehaviorSubject<JobFilter>({});

  public jobs$ = this.jobsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public selectedJob$ = this.selectedJobSubject.asObservable();
  public currentFilter$ = this.currentFilterSubject.asObservable();

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
    },
    {
      id: 'JOB-006',
      sku: 'SKU-44444',
      status: 'Completed',
      assignedUser: 'Emily Davis',
      createdDate: new Date('2024-01-08'),
      description: 'Furniture assembly and quality inspection',
      priority: 'high',
      location: 'Warehouse B - Section 2',
      estimatedCompletion: new Date('2024-01-11')
    },
    {
      id: 'JOB-007',
      sku: 'SKU-55555',
      status: 'Pending',
      assignedUser: 'David Chen',
      createdDate: new Date('2024-01-17'),
      description: 'Automotive parts inventory verification',
      priority: 'medium',
      location: 'Warehouse C - Section 4',
      estimatedCompletion: new Date('2024-01-25')
    },
    {
      id: 'JOB-008',
      sku: 'SKU-66666',
      status: 'In Progress',
      assignedUser: 'Lisa Rodriguez',
      createdDate: new Date('2024-01-12'),
      description: 'Garden tools organization and labeling',
      priority: 'low',
      location: 'Warehouse A - Section 5',
      estimatedCompletion: new Date('2024-01-19')
    },
    {
      id: 'JOB-009',
      sku: 'SKU-77777',
      status: 'Completed',
      assignedUser: 'Alex Thompson',
      createdDate: new Date('2024-01-09'),
      description: 'Sports equipment safety inspection',
      priority: 'high',
      location: 'Warehouse B - Section 1',
      estimatedCompletion: new Date('2024-01-13')
    },
    {
      id: 'JOB-010',
      sku: 'SKU-88888',
      status: 'Pending',
      assignedUser: 'Maria Garcia',
      createdDate: new Date('2024-01-18'),
      description: 'Pet supplies restocking and organization',
      priority: 'medium',
      location: 'Warehouse C - Section 3',
      estimatedCompletion: new Date('2024-01-26')
    },
    {
      id: 'JOB-011',
      sku: 'SKU-99999',
      status: 'In Progress',
      assignedUser: 'Robert Wilson',
      createdDate: new Date('2024-01-11'),
      description: 'Office supplies inventory count',
      priority: 'low',
      location: 'Warehouse A - Section 3',
      estimatedCompletion: new Date('2024-01-16')
    },
    {
      id: 'JOB-012',
      sku: 'SKU-10101',
      status: 'Completed',
      assignedUser: 'Jennifer Lee',
      createdDate: new Date('2024-01-07'),
      description: 'Baby products quality assurance check',
      priority: 'high',
      location: 'Warehouse B - Section 4',
      estimatedCompletion: new Date('2024-01-10')
    },
    {
      id: 'JOB-013',
      sku: 'SKU-20202',
      status: 'Pending',
      assignedUser: 'Michael Brown',
      createdDate: new Date('2024-01-19'),
      description: 'Seasonal decorations sorting and storage',
      priority: 'medium',
      location: 'Warehouse C - Section 2',
      estimatedCompletion: new Date('2024-01-28')
    },
    {
      id: 'JOB-014',
      sku: 'SKU-30303',
      status: 'In Progress',
      assignedUser: 'Amanda White',
      createdDate: new Date('2024-01-10'),
      description: 'Home improvement tools maintenance check',
      priority: 'high',
      location: 'Warehouse A - Section 4',
      estimatedCompletion: new Date('2024-01-15')
    },
    {
      id: 'JOB-015',
      sku: 'SKU-40404',
      status: 'Completed',
      assignedUser: 'Christopher Martinez',
      createdDate: new Date('2024-01-06'),
      description: 'Outdoor equipment weatherproofing inspection',
      priority: 'low',
      location: 'Warehouse B - Section 5',
      estimatedCompletion: new Date('2024-01-09')
    },
    {
      id: 'JOB-016',
      sku: 'SKU-50505',
      status: 'Pending',
      assignedUser: 'Rachel Green',
      createdDate: new Date('2024-01-20'),
      description: 'Art supplies inventory and organization',
      priority: 'medium',
      location: 'Warehouse C - Section 5',
      estimatedCompletion: new Date('2024-01-30')
    },
    {
      id: 'JOB-017',
      sku: 'SKU-60606',
      status: 'In Progress',
      assignedUser: 'Daniel Kim',
      createdDate: new Date('2024-01-09'),
      description: 'Musical instruments tuning and setup',
      priority: 'high',
      location: 'Warehouse A - Section 6',
      estimatedCompletion: new Date('2024-01-14')
    },
    {
      id: 'JOB-018',
      sku: 'SKU-70707',
      status: 'Completed',
      assignedUser: 'Sophie Anderson',
      createdDate: new Date('2024-01-05'),
      description: 'Kitchen appliances functionality testing',
      priority: 'medium',
      location: 'Warehouse B - Section 6',
      estimatedCompletion: new Date('2024-01-08')
    },
    {
      id: 'JOB-019',
      sku: 'SKU-80808',
      status: 'Pending',
      assignedUser: 'Kevin Johnson',
      createdDate: new Date('2024-01-21'),
      description: 'Fitness equipment assembly and testing',
      priority: 'high',
      location: 'Warehouse C - Section 6',
      estimatedCompletion: new Date('2024-02-01')
    },
    {
      id: 'JOB-020',
      sku: 'SKU-90909',
      status: 'In Progress',
      assignedUser: 'Nicole Taylor',
      createdDate: new Date('2024-01-08'),
      description: 'Jewelry and accessories quality control',
      priority: 'low',
      location: 'Warehouse A - Section 7',
      estimatedCompletion: new Date('2024-01-13')
    }
  ];

  constructor() {
    // Initialize with mock data
    this.jobsSubject.next([...this.mockJobs]);
  }

  // REST API for job list with filtering
  getJobs(filter?: JobFilter): Observable<Job[]> {
    this.loadingSubject.next(true);
    this.currentFilterSubject.next(filter || {});
    
    return of(this.mockJobs).pipe(
      delay(800), // Simulate network delay
      map(jobs => this.applyFilters(jobs, filter)),
      tap(jobs => {
        this.jobsSubject.next(jobs);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      })
    );
  }

  // GraphQL API for job detail
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
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      })
    );
  }

  // REST API for job status update
  updateJobStatus(request: JobUpdateRequest): Observable<Job> {
    this.loadingSubject.next(true);
    
    const jobIndex = this.mockJobs.findIndex(j => j.id === request.id);
    if (jobIndex === -1) {
      this.loadingSubject.next(false);
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
        
        // Reapply current filter and update jobs
        const currentFilter = this.currentFilterSubject.value;
        const filteredJobs = this.applyFilters([...this.mockJobs], currentFilter);
        this.jobsSubject.next(filteredJobs);
        
        // Update selected job if it's the same one
        const currentSelected = this.selectedJobSubject.value;
        if (currentSelected && currentSelected.id === job.id) {
          this.selectedJobSubject.next(job);
        }
      }),
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      })
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
    const currentFilter = this.currentFilterSubject.value;
    this.getJobs(currentFilter).subscribe();
  }

  private applyFilters(jobs: Job[], filter?: JobFilter): Job[] {
    if (!filter || Object.keys(filter).length === 0) return jobs;

    return jobs.filter(job => {
      // Status filter
      if (filter.status && job.status !== filter.status) {
        return false;
      }

      // Assigned user filter (case-insensitive partial match)
      if (filter.assignedUser && filter.assignedUser.trim()) {
        const userInput = filter.assignedUser.toLowerCase().trim();
        const jobUser = job.assignedUser.toLowerCase();
        if (!jobUser.includes(userInput)) {
          return false;
        }
      }

      // Start date filter
      if (filter.startDate) {
        const startDate = new Date(filter.startDate);
        startDate.setHours(0, 0, 0, 0); // Start of day
        const jobDate = new Date(job.createdDate);
        jobDate.setHours(0, 0, 0, 0);
        if (jobDate < startDate) {
          return false;
        }
      }

      // End date filter
      if (filter.endDate) {
        const endDate = new Date(filter.endDate);
        endDate.setHours(23, 59, 59, 999); // End of day
        const jobDate = new Date(job.createdDate);
        jobDate.setHours(0, 0, 0, 0);
        if (jobDate > endDate) {
          return false;
        }
      }

      return true;
    });
  }
} 