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
  public studentSelected: Student;
  public showForm: boolean;

  constructor(
    private sqliteService: SqliteManagerService
  ) {
    this.showForm = false;
    this.students = [];
    this.studentSelected = null;
  }

  ngOnInit() {
    this.getStudents();
  }

  getStudents(search?: string) {
    this.sqliteService.gettudents(search).then( (students: Student[]) => {
      this.students = students;
      console.log(this.students);
    })
  }

  onShowForm() {
    this.showForm = true;
  }

  filterList($event: any) {
    console.log($event.detail.valueO)
    this.getStudents($event.detail.value);
  }

  onCloseForm() {
    this.showForm = false;
  }
}
