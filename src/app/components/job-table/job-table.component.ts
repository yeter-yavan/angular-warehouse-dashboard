import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Job } from '../../models/job.model';

@Component({
  selector: 'app-job-table',
  templateUrl: './job-table.component.html',
  styleUrls: ['./job-table.component.css']
})
export class JobTableComponent {
  @Input() jobs: Job[] = [];
  @Input() loading = false;
  @Output() jobSelected = new EventEmitter<Job>();

  displayedColumns: string[] = ['id', 'sku', 'status', 'assignedUser', 'createdDate', 'actions'];
  dataSource = new MatTableDataSource<Job>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(): void {
    this.dataSource.data = this.jobs;
    this.setupTable();
  }

  ngAfterViewInit(): void {
    this.setupTable();
  }

  private setupTable(): void {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  onRowClick(job: Job): void {
    this.jobSelected.emit(job);
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

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
} 