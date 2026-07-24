import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-task-list',
  template: `
    <h2>Cloud Task Tracker</h2>
    <input #taskInput placeholder="Enter task..." />
    <button (click)="addTask(taskInput.value); taskInput.value=''">Add Task</button>
    <ul>
      <li *ngFor="let t of tasks">{{ t.title }}</li>
    </ul>
  `
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  private apiUrl = '/api/tasks'; // ALB will route /api to Node.js server

  constructor(private http: HttpClient) {}

  ngOnInit() { this.fetchTasks(); }

  fetchTasks() {
    this.http.get<any[]>(this.apiUrl).subscribe(data => this.tasks = data);
  }

  addTask(title: string) {
    if (!title) return;
    this.http.post(this.apiUrl, { title }).subscribe(() => this.fetchTasks());
  }
}