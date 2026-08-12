import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
  imports: [CommonModule]
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  private apiUrl = '/api/tasks';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchTasks();
    }
  }

  fetchTasks() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.tasks = [...data]; // Force a fresh array reference
        this.cdr.detectChanges(); // Tell Angular to immediately refresh the view
      },
      error: (err) => console.error('Error fetching tasks:', err)
    });
  }

  addTask(input: HTMLInputElement) {
    const title = input.value.trim();
    if (!title) return;

    input.value = ''; // Clear input box immediately

    this.http.post<any>(this.apiUrl, { title }).subscribe({
      next: (newTask) => {
        // Optimistically append the new task to the local array immediately
        this.tasks = [...this.tasks, newTask];
        this.cdr.detectChanges(); // Trigger instant template update
      },
      error: (err) => {
        console.error('Error adding task:', err);
        this.fetchTasks(); // Rollback / refresh on error
      }
    });
  }

  deleteTask(taskId: string) {
    // 1. Remove the task from the local array immediately (feels instant!)
    this.tasks = this.tasks.filter(t => t.taskId !== taskId);
    this.cdr.detectChanges();

    // 2. Send the DELETE request in the background
    this.http.delete(`${this.apiUrl}/${taskId}`).subscribe({
      error: (err) => {
        console.error('Error deleting task:', err);
        this.fetchTasks(); // Re-fetch from server if database delete fails
      }
    });
  }
}