import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Class } from 'src/app/models/class';
import { Student } from 'src/app/models/student';
import { AlertService } from 'src/app/services/alert.service';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';
import {Payment} from "../../../../../models/payment";
import {capSQLiteChanges} from "@capacitor-community/sqlite";

@Component({
  selector: 'app-form-classes',
  templateUrl: './form-classes.component.html',
  styleUrls: ['./form-classes.component.scss'],
})
export class FormClassesComponent  implements OnInit {

  @Input() classObj: Class;
  public payment: Payment;
  public paid: boolean;
  public alreadyPaid: boolean;

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

    if(!this.classObj){
      this.classObj = new Class();
      this.classObj.price = 0;
      this.payment = new Payment();
      this.paid = false;
      this.alreadyPaid = false;
    }else{
      this.update = true;

      this.sqliteService.getPaymentByClass(this.classObj.id).then( (payment: Payment) => {
        if (payment) {
          this.payment = payment;
          this.alreadyPaid = this.payment.paid == 1;
          this.paid = this.payment.paid == 1;
        } else {
          this.paid = false;
          this.payment = new Payment();
        }
      })

    }

    this.sqliteService.getStudents().then( (students: Student[]) => {
      this.students = students;
    })

  }

  createUpdateClass(){

    this.classObj.date_start = moment(this.classObj.date_start).format("YYYY-MM-DDTHH:mm");
    this.classObj.date_end = moment(this.classObj.date_end).format("YYYY-MM-DDTHH:mm");

    if(this.update){
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
    }else{
      this.sqliteService.createClass(this.classObj).then( (changes: capSQLiteChanges) =>{

        const idClass = changes.changes.lastId;
        this.payment.id_class = idClass;

        if (this.paid) {
          this.payment.date = moment(this.payment.date).format("YYYY-MM-DDTHH:mm");
          this.payment.paid = 1;
        } else  {
          this.payment.paid = 0;
        }

        this.sqliteService.createPayment(this.payment);

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

  closeForm(){
    this.close.emit(true);
  }

}
