import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Job } from '../../models/job.model';

@Component({
  selector: 'app-job-table',
  templateUrl: './job-table.component.html'
})
export class JobTableComponent implements AfterViewInit, OnChanges {
  private _jobs: Job[] = [];
  @Input() set jobs(value: Job[]) {
    this._jobs = value || [];
    this.dataSource.data = this._jobs;
    // Ensure paginator is connected after data is set
    setTimeout(() => {
      this.connectPaginator();
    });
  }
  get jobs(): Job[] {
    return this._jobs;
  }

  @Input() loading = false;
  @Output() jobSelected = new EventEmitter<Job>();

  displayedColumns: string[] = ['id', 'sku', 'status', 'assignedUser', 'createdDate', 'actions'];
  dataSource = new MatTableDataSource<Job>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.connectPaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobs'] && !changes['jobs'].firstChange) {
      this.connectPaginator();
    }
  }

  private connectPaginator(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      // Reset to first page when data changes
      if (this.paginator.pageIndex > 0) {
        this.paginator.firstPage();
      }
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  onRowClick(job: Job): void {
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

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
} 