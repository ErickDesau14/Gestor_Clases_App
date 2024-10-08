import {Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-list-data',
  templateUrl: './list-data.component.html',
  styleUrls: ['./list-data.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule
  ]
})
export class ListDataComponent {

  @Input({required: true}) data: any[];
  @Input() emptyText: string;
  @Input() addText: string;
  @Input() showAdd: boolean = true;

  @Output() add: EventEmitter<boolean>;

  @ContentChild('templateData', { static: false })
  templateData: TemplateRef<any>;

  constructor() {
    this.add = new EventEmitter<boolean>();
  }

  addData() {
    this.add.emit(true);
  }

}
