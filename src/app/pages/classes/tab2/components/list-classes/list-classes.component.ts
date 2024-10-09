import { Component, OnInit } from '@angular/core';
import {Class} from "../../../../../models/class";
import {SqliteManagerService} from "../../../../../service/sqlite-manager.service";
import {Student} from "../../../../../models/student";

@Component({
  selector: 'app-list-classes',
  templateUrl: './list-classes.component.html',
  styleUrls: ['./list-classes.component.scss'],
})
export class ListClassesComponent  implements OnInit {

  public classes: Class[];
  public classSelected: Class;
  public showForm: boolean;

  constructor(
    private sqliteService: SqliteManagerService
  ) {
    this.classes = [];
    this.showForm = false;
    this.classSelected = null;
  }

  ngOnInit() {
    this.getClasses();
  }

  getClasses() {

    Promise.all([
      this.sqliteService.getClasses(),
      this.sqliteService.getStudents()
    ]).then(results => {
      this.classes = results[0];
      let students = results[1];
      this.associateStudentsClasses(students);
      console.log(this.classes)
    })

  }

  private associateStudentsClasses(students: Student[]) {
    this.classes.forEach(c => {
      let student = students.find(s => s.id == c.id_student);
      if (student) {
        c.student = student;
      }
    })
  }

  onShowForm() {
    this.showForm = true;
  }

  onCloseForm() {
    this.showForm = false;

  }
}
