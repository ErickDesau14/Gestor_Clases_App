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

  ngOnInit() {}

}
