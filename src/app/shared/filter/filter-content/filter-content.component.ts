import {Component, Input, OnInit} from '@angular/core';
import {IonicModule, PopoverController} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {Filter} from "../../../models/filter";
import {Student} from "../../../models/student";
import {SqliteManagerService} from "../../../service/sqlite-manager.service";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-filter-content',
  templateUrl: './filter-content.component.html',
  styleUrls: ['./filter-content.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule
  ]
})
export class FilterContentComponent  implements OnInit {

  @Input() filter : Filter;

  public student: Student[];

  constructor(
    private sqliteService: SqliteManagerService,
    private popoverController: PopoverController
  ) {
    this.student = [];
  }

  ngOnInit() {
    this.sqliteService.getStudents().then( (students: Student[]) => {
      this.student = students;
    })
  }


  filterData() {
    this.popoverController.dismiss(this.filter);
  }

  reset() {
    this.filter = new Filter();
    this.popoverController.dismiss(this.filter);
  }
}
