import { Component, OnInit } from '@angular/core';
import {Payment} from "../../../../models/payment";
import {SqliteManagerService} from "../../../../services/sqlite-manager.service";
import {Class} from "../../../../models/class";
import {Student} from "../../../../models/student";
import {Filter} from "../../../../models/filter";

@Component({
  selector: 'app-list-payment',
  templateUrl: './list-payment.component.html',
  styleUrls: ['./list-payment.component.scss'],
})
export class ListPaymentComponent  implements OnInit {

  public payments: Payment[];
  public total: number;
  public filter: Filter;

  constructor(
    private sqliteService: SqliteManagerService
  ) {
    this.payments = [];
  }

  ngOnInit() {
    this.getPayments();
    this.total = 0;
    this.filter = new Filter();
    this.filter.paid = null;
  }

  getPayments() {
    Promise.all([
      this.sqliteService.getPayments(this.filter),
      this.sqliteService.getClasses(),
      this.sqliteService.getStudents()
    ]).then ( (results) => {
      this.payments = results[0];
      let classes = results[1];
      let students = results[2];
      this.associateObjects(classes, students);
      console.log(this.payments);
      this.calculateTotal();
      console.log(this.total);
    })

  }

  calculateTotal() {
    this.total = this.payments.reduce((acum: number, payment: Payment) => acum + payment.class.price, 0);
  }

  associateObjects(classes: Class[], students: Student[]) {
    this.payments.forEach(p => {
      p.class = classes.find(c => c.id == p.id_class);
      if (p.class) {
        p.class.student = students.find(s => s.id == p.class.id_student);
      }
    })
  }

  filterData($event: Filter) {
    this.filter = $event;
    this.getPayments();
  }
}
