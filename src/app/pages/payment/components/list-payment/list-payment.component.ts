import { Component, OnInit } from '@angular/core';
import {Payment} from "../../../../models/payment";
import {SqliteManagerService} from "../../../../services/sqlite-manager.service";
import {Class} from "../../../../models/class";
import {Student} from "../../../../models/student";

@Component({
  selector: 'app-list-payment',
  templateUrl: './list-payment.component.html',
  styleUrls: ['./list-payment.component.scss'],
})
export class ListPaymentComponent  implements OnInit {

  public payments: Payment[];

  constructor(
    private sqliteService: SqliteManagerService
  ) {
    this.payments = [];
  }

  ngOnInit() {
    this.getPayments();
  }

  getPayments() {
    Promise.all([
      this.sqliteService.getPayments(),
      this.sqliteService.getClasses(),
      this.sqliteService.getStudents()
    ]).then ( (results) => {
      this.payments = results[0];
      let classes = results[1];
      let students = results[2];
      this.associateObjects(classes, students);
      console.log(this.payments);
    })

  }

  associateObjects(classes: Class[], students: Student[]) {
    this.payments.forEach(p => {
      p.class = classes.find(c => c.id == p.id_class);
      if (p.class) {
        p.class.student = students.find(s => s.id == p.class.id_student);
      }
    })
  }

}
