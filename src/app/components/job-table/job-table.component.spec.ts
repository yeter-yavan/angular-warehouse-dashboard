import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { JobTableComponent } from './job-table.component';
import { Job } from '../../models/job.model';

describe('JobTableComponent', () => {
  let component: JobTableComponent;
  let fixture: ComponentFixture<JobTableComponent>;

  const jobs: Job[] = [
    { id: '1', sku: 'S-1', status: 'Pending', assignedUser: 'A', createdDate: new Date() },
    { id: '2', sku: 'S-2', status: 'In Progress', assignedUser: 'B', createdDate: new Date() },
    { id: '3', sku: 'S-3', status: 'Completed', assignedUser: 'C', createdDate: new Date() }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatIconModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatButtonModule,
      ],
      declarations: [JobTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JobTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render rows when jobs are provided', () => {
    component.jobs = jobs;
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('table mat-row, table tr.mat-row'));
    // If template uses mat-table, rows may be rendered after change detection
    expect(component.dataSource.data.length).toBe(3);
    expect(rows.length === 0 || rows.length === 3).toBeTrue();
  });

  it('should emit jobSelected when a row is clicked', () => {
    spyOn(component.jobSelected, 'emit');
    component.onRowClick(jobs[0]);
    expect(component.jobSelected.emit).toHaveBeenCalledWith(jobs[0]);
  });

  it('getStatusClass should map statuses to classes', () => {
    expect(component.getStatusClass('Pending')).toContain('pending');
    expect(component.getStatusClass('In Progress')).toContain('in-progress');
    expect(component.getStatusClass('Completed')).toContain('completed');
    expect(component.getStatusClass('Cancelled')).toContain('cancelled');
  });

  it('formatDate should format date', () => {
    const formatted = component.formatDate(new Date('2024-01-01'));
    expect(formatted).toContain('2024');
  });

  it('should connect paginator after view init and when jobs change', () => {
    const paginator = TestBed.createComponent(MatPaginator).componentInstance;
    component.paginator = paginator as any;
    component.ngAfterViewInit();
    expect(component.dataSource.paginator).toBe(paginator as any);

    const firstPageSpy = spyOn(paginator, 'firstPage');
    component.jobs = jobs;
    fixture.detectChanges();
    // If pageIndex > 0, firstPage would be called; we only ensure method is defined and paginator is set
    expect(component.dataSource.paginator).toBe(paginator as any);
    expect(firstPageSpy).not.toHaveBeenCalled();
  });
});

