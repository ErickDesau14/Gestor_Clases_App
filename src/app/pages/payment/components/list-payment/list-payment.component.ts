import { Component, OnInit } from '@angular/core';
import {Payment} from "../../../../models/payment";
import {SqliteManagerService} from "../../../../services/sqlite-manager.service";

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
      console.log(this.payments);
    })
  }

}
