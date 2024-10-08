import { Component, OnInit } from '@angular/core';
import {Student} from "../../../../../models/student";
import {SqliteManagerService} from "../../../../../service/sqlite-manager.service";

@Component({
  selector: 'app-list-students',
  templateUrl: './list-students.component.html',
  styleUrls: ['./list-students.component.scss'],
})
export class ListStudentsComponent  implements OnInit {

  public students: Student[];
  public showForm: boolean;

  constructor(
    private sqliteService: SqliteManagerService
  ) {
    this.showForm = false;
    this.students = [];
  }

  ngOnInit() {}

  onShowForm() {
    this.showForm = true;
  }
}
