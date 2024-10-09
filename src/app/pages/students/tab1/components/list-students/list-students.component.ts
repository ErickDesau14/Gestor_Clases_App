import { Component, OnInit } from '@angular/core';
import {Student} from "../../../../../models/student";
import {SqliteManagerService} from "../../../../../service/sqlite-manager.service";
import {AlertService} from "../../../../../service/alert.service";
import {TranslateService} from "@ngx-translate/core";

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
    private sqliteService: SqliteManagerService,
    private alertService: AlertService,
    private translate: TranslateService
  ) {
    this.showForm = false;
    this.students = [];
    this.studentSelected = null;
  }

  ngOnInit() {
    this.getStudents();
  }

  getStudents(search?: string) {
    this.sqliteService.getStudents(search).then( (students: Student[]) => {
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
    this.studentSelected = null;
    this.getStudents();
  }

  updateStudent(item: Student) {
    this.studentSelected = item;
    this.showForm = true;
  }

  deleteStudentConfirm(item: Student) {

    const self = this;
    this.alertService.alertConfirm(
      this.translate.instant('label.confirm'),
      this.translate.instant('label.confirm.message.student'),
      function () {
        self.deleteStudent(item);
      }
    )
  }

  deleteStudent(student: Student) {
    this.sqliteService.deleteStudent(student).then( () => {
      this.alertService.alertMessage(
        this.translate.instant('label.success'),
        this.translate.instant('label.success.message.remove.student')
      );
      this.getStudents();
    } ).catch( err => {
      this.alertService.alertMessage(
        this.translate.instant('label.error'),
        this.translate.instant('label.error.message.remove.student')
      );
    })
  }

}
