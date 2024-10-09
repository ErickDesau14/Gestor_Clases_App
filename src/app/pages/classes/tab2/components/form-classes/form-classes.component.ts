import {Component, EventEmitter, Input, OnInit, Output, output} from '@angular/core';
import {Class} from "../../../../../models/class";
import {Student} from "../../../../../models/student";
import {SqliteManagerService} from "../../../../../service/sqlite-manager.service";

@Component({
  selector: 'app-form-classes',
  templateUrl: './form-classes.component.html',
  styleUrls: ['./form-classes.component.scss'],
  standalone: true
})
export class FormClassesComponent  implements OnInit {

  @Input()  classObj: Class;

  @Output() closeEvent: EventEmitter<boolean>;

  public update: boolean;
  public students: Student[];

  constructor(
    private sqliteService: SqliteManagerService
  ) {
    this.update = false;
    this.closeEvent = new EventEmitter<boolean>();
  }

  ngOnInit() {

    if (!this.classObj) {
      this.classObj = new Class();
    } else {
      this.update = true;
    }

    this.sqliteService.getStudents().then( (students: Student[]) => {
      this.students = students;
    })

  }

  closeForm(){
    this.closeEvent.emit(true);
  }

}
