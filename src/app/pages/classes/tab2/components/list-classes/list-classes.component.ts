import { Component, OnInit } from '@angular/core';
import {Class} from "../../../../../models/class";
import {SqliteManagerService} from "../../../../../service/sqlite-manager.service";

@Component({
  selector: 'app-list-classes',
  templateUrl: './list-classes.component.html',
  styleUrls: ['./list-classes.component.scss'],
})
export class ListClassesComponent  implements OnInit {

  public classes: Class[];
  public showForm: boolean;

  constructor(
    private sqliteService: SqliteManagerService
  ) {
    this.classes = [];
    this.showForm = false;
  }

  ngOnInit() {}

  onShowForm() {
    this.showForm = true;
  }
}
