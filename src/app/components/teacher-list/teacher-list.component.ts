import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Teacher } from '../../models/teacher.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css'],
  imports: [FormsModule, CommonModule]
})
export class TeacherListComponent implements OnInit {
  teachers: Teacher[] = [];
  searchQuery = '';

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.teachers = this.dataService.getTeachers();
  }

  search(): void {
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      this.teachers = this.dataService.getTeachers().filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.department.toLowerCase().includes(query)
      );
    } else {
      this.loadTeachers();
    }
  }

  getRatingColor(rating: number): string {
    if (rating >= 6) return 'bg-success';
    if (rating >= 4) return 'bg-warning';
    return 'bg-danger';
  }
}
