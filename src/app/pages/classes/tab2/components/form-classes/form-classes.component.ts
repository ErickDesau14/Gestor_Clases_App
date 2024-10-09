import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Class} from "../../../../../models/class";
import {Student} from "../../../../../models/student";
import {SqliteManagerService} from "../../../../../service/sqlite-manager.service";
import {FormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {NgForOf} from "@angular/common";
import * as moment from "moment";
import {AlertService} from "../../../../../service/alert.service";

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

  @Input() classObj: Class;

  @Output() close: EventEmitter<boolean>;

  public update: boolean;
  public students: Student[];

  constructor(
    private sqliteService: SqliteManagerService,
    private alertService: AlertService,
    private translate: TranslateService
  ) {
    this.update = false;
    this.close = new EventEmitter<boolean>();
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

  closeForm() {
    this.close.emit(true);
  }

  createUpdateClass() {

    this.classObj.date_start = moment(this.classObj.date_start).format('YYYY-MM-DDTHH:mm');

    this.classObj.date_end = moment(this.classObj.date_end).format('YYYY-MM-DDTHH:mm');

    if (this.update) {
      this.sqliteService.updateClass(this.classObj).then( () => {
        this.alertService.alertMessage(
          this.translate.instant('label.success'),
          this.translate.instant('label.success.message.edit.class')
        );
        this.closeForm();
      }).catch(err => {
        this.alertService.alertMessage(
          this.translate.instant('label.error'),
          this.translate.instant('label.error.message.edit.class')
        )
      });
    } else {
      this.sqliteService.createClass(this.classObj).then( () =>{
        this.alertService.alertMessage(
          this.translate.instant('label.success'),
          this.translate.instant('label.success.message.add.class')
        );
        this.closeForm();
      }).catch(err => {
        this.alertService.alertMessage(
          this.translate.instant('label.error'),
          this.translate.instant('label.error.message.add.class')
        )
      });
    }

  }
}
