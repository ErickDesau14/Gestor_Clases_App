import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Student} from "../../../../../models/student";
import {SqliteManagerService} from "../../../../../service/sqlite-manager.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-form-student',
  templateUrl: './form-student.component.html',
  styleUrls: ['./form-student.component.scss'],
})
export class FormStudentComponent  implements OnInit {

  @Input() student: Student;

  @Output() closeEvent: EventEmitter<boolean>;

  public update: boolean;

  constructor(
    private sqliteService: SqliteManagerService,
    private translate: TranslateService
  ) {
    this.closeEvent = new EventEmitter<boolean>();
  }

  ngOnInit() {
    if (!this.student) {
      this.student = new Student();

    } else {
      this.update = true;
    }
  }

  closeForm() {
    this.closeEvent.emit(true);
  }

  createUpdateStudent() {

  }
}
