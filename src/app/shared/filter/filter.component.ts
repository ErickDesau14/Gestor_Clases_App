import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IonicModule, PopoverController} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {FilterContentComponent} from "./filter-content/filter-content.component";
import {TranslateModule} from "@ngx-translate/core";
import {Filter} from "../../models/filter";
import * as moment from "moment";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FilterContentComponent,
    TranslateModule
  ]
})
export class FilterComponent  implements OnInit {

  @Input() filter : Filter;

  @Output() filterData: EventEmitter<Filter>;

  public showFilter: boolean;

  constructor(
    private popoverController: PopoverController
  ) {
    this.showFilter = false;
    this.filterData = new EventEmitter<Filter>();
  }

  ngOnInit() {
    // this.createPopover(null);
    if (!this.filter.date_start) {
      this.filter.date_start = moment().format("YYYY-MM-DDHH:mm");
    }
    if (!this.filter.date_end) {
      this.filter.date_end = moment().format("YYYY-MM-DDHH:mm");
    }
  }

  async createPopover(event: any) {
    const popover = await this.popoverController.create({
      component: FilterContentComponent,
      backdropDismiss: true,
      event,
      cssClass: 'custom-popover-content',
      componentProps: {
        filter: this.filter
      }
    })

    popover.onDidDismiss().then( (event) => {
      console.log(event.data);
      this.showFilter = false;
      if (event.data) {
        this.filterData.emit(event.data);
      }
    })

    await popover.present();
  }

  showHideFilter($event: MouseEvent) {
    this.showFilter = !this.showFilter;

    if(this.showFilter){
      this.createPopover($event);
    }
  }



}
