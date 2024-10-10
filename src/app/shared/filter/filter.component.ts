import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { FilterContentComponent } from './filter-content/filter-content.component';
import { TranslateModule } from '@ngx-translate/core';
import { Filter } from 'src/app/models/filter';
import * as moment from 'moment';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FilterContentComponent, TranslateModule]
})
export class FilterComponent implements OnInit {

  @Input() filter: Filter;
  @Input() payment: boolean = false;

  @Output() filterData: EventEmitter<Filter>;

  public showFilter: boolean;

  constructor(
    private popoverController: PopoverController
  ) {
    this.showFilter = false;
    this.filterData = new EventEmitter<Filter>();
  }

  ngOnInit() {
    if(!this.filter.date_start){
      this.filter.date_start = moment().format("YYYY-MM-DDTHH:mm");
    }
    if(!this.filter.date_end){
      this.filter.date_end = moment().format("YYYY-MM-DDTHH:mm");
    }
    if (this.filter.paid === null) {
      this.filter.paid = false;
    }
  }

  async createPopover(event: any) {
    const popover = await this.popoverController.create({
      component: FilterContentComponent,
      backdropDismiss: true,
      event,
      cssClass: 'custom-popover-content',
      componentProps: {
        filter: this.filter,
        payment: this.payment
      }
    })

    popover.onDidDismiss().then((event) => {
      console.log(event);
      this.showFilter = false;
      if(event.data){
        this.filterData.emit(event.data);
      }

    })

    await popover.present();
  }

  showHideFilter($event) {

    this.showFilter = !this.showFilter;

    if (this.showFilter) {
      this.createPopover($event);
    }

  }

}
