import { fakeAsync, tick } from '@angular/core/testing';
import { take } from 'rxjs/operators';
import { JobService } from './job.service';
import { JobFilter, JobStatus, JobUpdateRequest } from '../models/job.model';

describe('JobService', () => {
  let service: JobService;

  beforeEach(() => {
    service = new JobService();
  });

  it('should initialize with mock jobs and expose streams', (done) => {
    let jobsReceived = false;
    let loadingReceived = false;

    service.jobs$.pipe(take(1)).subscribe((jobs) => {
      expect(Array.isArray(jobs)).toBeTrue();
      expect(jobs.length).toBeGreaterThan(0);
      jobsReceived = true;
      if (jobsReceived && loadingReceived) done();
    });

    service.loading$.pipe(take(1)).subscribe((loading) => {
      expect(loading).toBeFalse();
      loadingReceived = true;
      if (jobsReceived && loadingReceived) done();
    });
  });

  it('getJobs should apply filters and update streams', fakeAsync(() => {
    const filter: JobFilter = { status: 'Pending' };

    let latestLoading: boolean | undefined;
    service.loading$.subscribe((l) => (latestLoading = l));

    service.getJobs(filter).subscribe();

    // loading should be true immediately due to next(true)
    expect(latestLoading).toBeTrue();

    tick(800); // wait for simulated delay

    let receivedJobs: string[] = [];
    service.jobs$.pipe(take(1)).subscribe((jobs) => {
      receivedJobs = jobs.map((j) => j.status);
    });
    expect(receivedJobs.length).toBeGreaterThan(0);
    // All should match filter
    expect(receivedJobs.every((s) => s === 'Pending')).toBeTrue();
    expect(latestLoading).toBeFalse();

    // currentFilter$ should be updated
    service.currentFilter$.pipe(take(1)).subscribe((f) => {
      expect(f).toEqual(filter);
    });
  }));

  it('getJobById should return a job and toggle loading', fakeAsync(() => {
    let latestLoading: boolean | undefined;
    service.loading$.subscribe((l) => (latestLoading = l));

    let jobId = 'JOB-001';
    let name: string | undefined;
    service.getJobById(jobId).subscribe((job) => (name = job.assignedUser));

    expect(latestLoading).toBeTrue();
    tick(500);
    expect(name).toBeDefined();
    expect(latestLoading).toBeFalse();
  }));

  it('getJobById should error for unknown id', fakeAsync(() => {
    let errorMsg: string | undefined;
    service.getJobById('UNKNOWN').subscribe({
      next: () => fail('should not emit next for unknown id'),
      error: (err) => (errorMsg = String(err.message ?? err))
    });
    tick(500);
    expect(errorMsg).toContain('not found');
  }));

  it('updateJobStatus should update job, streams and selected job', fakeAsync(() => {
    // Preselect job
    const targetId = 'JOB-002';
    service.getJobById(targetId).subscribe((job) => service.selectJob(job));
    tick(500);

    const request: JobUpdateRequest = {
      id: targetId,
      status: 'Completed' as JobStatus,
      assignedUser: 'QA Engineer'
    };

    let selectedAssigned: string | undefined;
    service.selectedJob$.subscribe((job) => (selectedAssigned = job?.assignedUser));

    service.updateJobStatus(request).subscribe();

    tick(600);

    // jobs list should include updated status after filter re-application
    let updatedStatuses: string[] = [];
    service.jobs$.pipe(take(1)).subscribe((jobs) => (updatedStatuses = jobs.filter(j => j.id === targetId).map(j => j.status)));
    expect(updatedStatuses).toEqual(['Completed']);

    // selected job should be updated too
    expect(selectedAssigned).toBe('QA Engineer');
  }));

  it('updateJobStatus should error for unknown id', fakeAsync(() => {
    const badRequest: JobUpdateRequest = { id: 'NOPE', status: 'Pending' };
    let errorMsg: string | undefined;
    service.updateJobStatus(badRequest).subscribe({
      next: () => fail('should not succeed'),
      error: (err) => (errorMsg = String(err.message ?? err))
    });
    // no delay path before error is returned from method
    expect(errorMsg).toContain('not found');
  }));

  it('selectJob and clearSelectedJob should update selectedJob$', fakeAsync(() => {
    let initial: any;
    service.selectedJob$.pipe(take(1)).subscribe((j) => (initial = j));
    expect(initial).toBeNull();

    service.getJobById('JOB-003').subscribe((job) => {
      service.selectJob(job);
    });
    tick(500);

    let selected: any;
    service.selectedJob$.pipe(take(1)).subscribe((j) => (selected = j));
    expect(selected?.id).toBe('JOB-003');

    service.clearSelectedJob();
    let cleared: any;
    service.selectedJob$.pipe(take(1)).subscribe((j) => (cleared = j));
    expect(cleared).toBeNull();
  }));

  it('refreshJobs should call getJobs with current filter', fakeAsync(() => {
    const spy = spyOn(service, 'getJobs').and.callThrough();
    const filter: JobFilter = { assignedUser: 'john' };
    service.getJobs(filter).subscribe();
    tick(800);

    service.refreshJobs();
    expect(spy).toHaveBeenCalledWith(filter);
    tick(800);
  }));
});

