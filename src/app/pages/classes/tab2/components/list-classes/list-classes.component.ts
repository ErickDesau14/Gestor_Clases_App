import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Class } from 'src/app/models/class';
import { Filter } from 'src/app/models/filter';
import { Student } from 'src/app/models/student';
import { AlertService } from 'src/app/services/alert.service';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';
import {Payment} from "../../../../../models/payment";
import * as moment from 'moment';
import * as console from "console";

@Component({
  selector: 'app-list-classes',
  templateUrl: './list-classes.component.html',
  styleUrls: ['./list-classes.component.scss'],
})
export class ListClassesComponent implements OnInit {

  public classes: Class[];
  public classSelected: Class;
  public showForm: boolean;
  public filter: Filter;

  constructor(
    private sqliteService: SqliteManagerService,
    private alertService: AlertService,
    private translate: TranslateService
  ) {
    this.classes = [];
    this.showForm = false;
    this.classSelected = null;
    this.filter = new Filter();
  }

  ngOnInit() {
    this.getClasses();
  }

  getClasses(){

    Promise.all([
      this.sqliteService.getClasses(this.filter),
      this.sqliteService.getStudents(),
      this.sqliteService.getPayments()
    ]).then(results => {
      this.classes = results[0];
      let students = results[1];
      let payments = results[2];
      this.associateStudentsClasses(students);
      this.needPayClasses(payments);
      console.log(this.classes);

    })

  }

  private associateStudentsClasses(students: Student[]){
    this.classes.forEach(c => {
      let student = students.find(s => s.id == c.id_student);
      if(student){
        c.student = student;
      }
    })
  }

  private needPayClasses(payments: Payment[]) {
    payments.forEach(p => {
      let classFound = this.classes.find(c => c.id == p.id_class);
      if(classFound && !p.paid){
        classFound.needPay = true;
      }
    })
  }

  updateClass(item: Class){
    this.classSelected = item;
    this.showForm = true;
  }

  deleteClassConfirm(item: Class){
    const self = this;
    this.alertService.alertConfirm(
      this.translate.instant('label.confirm'),
      this.translate.instant('label.confirm.message.class'),
      function() {
        self.deleteClass(item);
      }
    )
  }

  deleteClass(c: Class){
    this.sqliteService.deleteClass(c).then( () => {
      this.alertService.alertMessage(
        this.translate.instant('label.success'),
        this.translate.instant('label.success.message.remove.class')
      )
      this.getClasses();
    }).catch(err => {
      this.alertService.alertMessage(
        this.translate.instant('label.error'),
        this.translate.instant('label.error.message.remove.class')
      )
    })
  }

  filterData($event: Filter){
    this.filter = $event;
    console.log(this.filter);
    this.getClasses();
  }

  onShowForm() {
    this.showForm = true;
  }

  onCloseForm(){
    this.showForm = false;
    this.classSelected = null;
    this.filter = new Filter();
    this.getClasses();
  }

  payClass(c: Class) {
    this.sqliteService.getPaymentByClass(c.id).then( (payment: Payment)=> {
      if(payment){
        payment.date = moment().format('YYYY-MM-DDTHH:mm');
        payment.paid = 1;
        this.sqliteService.updatePayment(payment).then( () => {
          this.alertService.alertMessage(
            this.translate.instant('label.success'),
            this.translate.instant('label.success.message.paid.class')
          );
          this.filter = new Filter();
          this.getClasses();
        }).catch(err=> console.log(err));
      }
    }).catch(err=> console.log(err));
  }

}
