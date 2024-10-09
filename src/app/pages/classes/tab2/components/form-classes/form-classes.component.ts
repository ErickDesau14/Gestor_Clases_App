import {Component, EventEmitter, Input, OnInit, Output, output} from '@angular/core';
import {Class} from "../../../../../models/class";
import {Student} from "../../../../../models/student";
import {SqliteManagerService} from "../../../../../service/sqlite-manager.service";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-form-classes',
  templateUrl: './form-classes.component.html',
  styleUrls: ['./form-classes.component.scss'],
  imports: [
    FormsModule,
    TranslateModule,
    IonicModule,
    NgForOf
  ],
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
      this.classObj.price = 0;
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

  createUpdateClass() {

  }
}
