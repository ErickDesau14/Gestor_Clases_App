import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import {ListPaymentComponent} from "../components/list-payment/list-payment.component";
import {TranslateModule} from "@ngx-translate/core";
import {ListDataComponent} from "../../../shared/list-data/list-data.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab3PageRoutingModule,
    TranslateModule.forChild(),
    ListDataComponent
  ],
  declarations: [Tab3Page, ListPaymentComponent]
})
export class Tab3PageModule {}
