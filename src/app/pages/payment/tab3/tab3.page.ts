import { Component, ViewChild } from '@angular/core';
import {ListPaymentComponent} from "../components/list-payment/list-payment.component";
import {Filter} from "../../../models/filter";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  @ViewChild(ListPaymentComponent) listPayments: ListPaymentComponent;

  constructor() {}

  ionViewWillEnter(){
    if(this.listPayments){
      this.listPayments.filter = new Filter();
      this.listPayments.filter.paid = null;
      this.listPayments.getPayments();
    }
  }

}
