import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { of, Subject } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { JobService } from '../../services/job.service';
import { Job, JobFilter } from '../../models/job.model';

class JobServiceStub {
  private jobsSubject = new Subject<Job[]>();
  private loadingSubject = new Subject<boolean>();
  private selectedJobSubject = new Subject<Job | null>();
  private currentFilterSubject = new Subject<JobFilter>();

  jobs$ = this.jobsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  selectedJob$ = this.selectedJobSubject.asObservable();
  currentFilter$ = this.currentFilterSubject.asObservable();

  getJobs(filter?: JobFilter) { this.currentFilterSubject.next(filter || {}); return of([{ id:'1', sku:'S', status:'Pending', assignedUser:'U', createdDate: new Date() }]); }
  getJobById() { return of({ id:'1', sku:'S', status:'Pending', assignedUser:'U', createdDate: new Date() }); }
  updateJobStatus() { return of({ id:'1', sku:'S', status:'Completed', assignedUser:'U', createdDate: new Date() }); }
  selectJob(job: Job) { this.selectedJobSubject.next(job); }
  clearSelectedJob() { this.selectedJobSubject.next(null); }
  refreshJobs() {}
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let service: JobServiceStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatButtonToggleModule,
        MatSidenavModule,
        MatProgressSpinnerModule,
      ],
      declarations: [DashboardComponent],
      providers: [{ provide: JobService, useClass: JobServiceStub }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(JobService) as unknown as JobServiceStub;
  });

  it('should load jobs on init and subscribe to streams', () => {
    spyOn(service, 'getJobs').and.callThrough();
    fixture.detectChanges();
    expect(service.getJobs).toHaveBeenCalled();
  });

  it('onFilterChange should update filter and reload', () => {
    spyOn(service, 'getJobs').and.callThrough();
    fixture.detectChanges();
    const filter: JobFilter = { assignedUser: 'john' };
    component.onFilterChange(filter);
    expect(component.currentFilter).toEqual(filter);
    expect(service.getJobs).toHaveBeenCalledWith(filter);
  });

  it('onJobSelected should delegate to service', () => {
    spyOn(service, 'selectJob').and.callThrough();
    const job: Job = { id:'1', sku:'S', status:'Pending', assignedUser:'U', createdDate: new Date() };
    component.onJobSelected(job);
    expect(service.selectJob).toHaveBeenCalledWith(job);
  });

  it('onSidebarClose should clear selection', () => {
    spyOn(service, 'clearSelectedJob').and.callThrough();
    component.onSidebarClose();
    expect(service.clearSelectedJob).toHaveBeenCalled();
  });

  it('onStatusUpdate should call updateJobStatus', () => {
    spyOn(service, 'updateJobStatus').and.callThrough();
    component.onStatusUpdate({ id:'1', status:'Completed' });
    expect(service.updateJobStatus).toHaveBeenCalled();
  });

  it('toggleViewMode should switch mode', () => {
    component.viewMode = 'table';
    component.toggleViewMode();
    expect(component.viewMode).toBe('cards');
  });

  it('toggleHeaderTheme should persist preference', () => {
    component.isDarkHeader = false;
    component.toggleHeaderTheme();
    expect(component.isDarkHeader).toBeTrue();
    expect(localStorage.getItem('isDarkHeader')).toBe('true');
  });
});

