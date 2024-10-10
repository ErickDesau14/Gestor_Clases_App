import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Class } from 'src/app/models/class';
import { Filter } from 'src/app/models/filter';
import { Student } from 'src/app/models/student';
import { AlertService } from 'src/app/services/alert.service';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';

@Component({
  selector: 'app-list-classes',
  templateUrl: './list-classes.component.html',
  styleUrls: ['./list-classes.component.scss'],
})
export class ListClassesComponent implements OnInit {

  public classes: Class[];
  public classSelected: Class;
  public showForm: boolean;
  public filter: Filter;

  constructor(
    private sqliteService: SqliteManagerService,
    private alertService: AlertService,
    private translate: TranslateService
  ) {
    this.classes = [];
    this.showForm = false;
    this.classSelected = null;
    this.filter = new Filter();
  }

  ngOnInit() {
    this.getClasses();
  }

  getClasses(){

    Promise.all([
      this.sqliteService.getClasses(this.filter),
      this.sqliteService.getStudents()
    ]).then(results => {
      this.classes = results[0];
      let students = results[1];
      this.associateStudentsClasses(students);
      console.log(this.classes);

    })

  }

  private associateStudentsClasses(students: Student[]){
    this.classes.forEach(c => {
      let student = students.find(s => s.id == c.id_student);
      if(student){
        c.student = student;
      }
    })
  }

  updateClass(item: Class){
    this.classSelected = item;
    this.showForm = true;
  }

  deleteClassConfirm(item: Class){
    const self = this;
    this.alertService.alertConfirm(
      this.translate.instant('label.confirm'),
      this.translate.instant('label.confirm.message.class'),
      function() {
        self.deleteClass(item);
      }
    )
  }

  deleteClass(c: Class){
    this.sqliteService.deleteClass(c).then( () => {
      this.alertService.alertMessage(
        this.translate.instant('label.success'),
        this.translate.instant('label.success.message.remove.class')
      )
      this.getClasses();
    }).catch(err => {
      this.alertService.alertMessage(
        this.translate.instant('label.error'),
        this.translate.instant('label.error.message.remove.class')
      )
    })
  }

  filterData($event: Filter){
    this.filter = $event;
    console.log(this.filter);
    this.getClasses();
  }

  onShowForm() {
    this.showForm = true;
  }

  onCloseForm(){
    this.showForm = false;
    this.classSelected = null;
    this.filter = new Filter();
    this.getClasses();
  }
}
