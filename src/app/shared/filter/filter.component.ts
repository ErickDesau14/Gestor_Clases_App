import {Component, Input, OnInit} from '@angular/core';
import {IonicModule, PopoverController} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {FilterContentComponent} from "./filter-content/filter-content.component";
import {TranslateModule} from "@ngx-translate/core";
import {Filter} from "../../models/filter";

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

  public showFilter: boolean;

  constructor(
    private popoverController: PopoverController
  ) {
    this.showFilter = false;
  }

  ngOnInit() {
    // this.createPopover(null);
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
      this.showFilter = false;
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
