import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapacitorSQLite, JsonSQLite, capSQLiteChanges, capSQLiteValues } from '@capacitor-community/sqlite';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Student } from '../models/student';
import { Class } from '../models/class';
import { Filter } from '../models/filter';
import {Payment} from "../models/payment";

@Injectable({
  providedIn: 'root'
})
export class SqliteManagerService {

  public dbReady: BehaviorSubject<boolean>;
  private isWeb: boolean;
  private dbName: string;

  private DB_SETUP_KEY = 'first_db_setup';
  private DB_NAME_KEY = 'db_name';

  constructor(
    private alertController: AlertController,
    private http: HttpClient
  ) {
    this.isWeb = false;
    this.dbName = '';
    this.dbReady = new BehaviorSubject(false);
  }

  async init() {

    const info = await Device.getInfo();
    const sqlite = CapacitorSQLite as any;

    if (info.platform == 'android') {
      try {
        await sqlite.requestPermissions();
      } catch (error) {
        const alert = await this.alertController.create({
          header: 'Sin acceso a la base de datos',
          message: 'Esta app no puede funcionar sin accesso a la base de datos',
          buttons: ['OK']
        });
        await alert.present();
      }
    } else if (info.platform == 'web') {
      this.isWeb = true;
      await sqlite.initWebStore();
    }

    this.setupDatabase();

  }

  async setupDatabase() {
    const dbSetupDone = await Preferences.get({ key: this.DB_SETUP_KEY });

    if (!dbSetupDone.value) {
      this.downloadDatabase();
    } else {
      const dbName = await this.getDbName();
      await CapacitorSQLite.createConnection({ database: dbName });
      await CapacitorSQLite.open({ database: dbName });
      this.dbReady.next(true);
    }
  }

  downloadDatabase() {
    this.http.get('assets/db/db.json').subscribe(async (jsonExport: JsonSQLite) => {
      const jsonstring = JSON.stringify(jsonExport);
      const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });

      if (isValid.result) {
        this.dbName = jsonExport.database;
        await CapacitorSQLite.importFromJson({ jsonstring });
        await CapacitorSQLite.createConnection({ database: this.dbName });
        await CapacitorSQLite.open({ database: this.dbName });

        await Preferences.set({ key: this.DB_SETUP_KEY, value: '1' });
        await Preferences.set({ key: this.DB_NAME_KEY, value: this.dbName });
        this.dbReady.next(true);
      }
    })


  }

  async getDbName() {
    if (!this.dbName) {
      const dbName = await Preferences.get({ key: this.DB_NAME_KEY });
      this.dbName = dbName.value;
    }
    return this.dbName;
  }

  async createStudent(student: Student) {
    let sql = 'INSERT INTO students(name, surname, email, phone) VALUES(?,?,?,?)';

    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            student.name,
            student.surname,
            student.email,
            student.phone
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({
          database: dbName
        });
      }
      return changes;
    })


  }

  async getStudents(search?: string) {
    let sql = 'SELECT * FROM students WHERE active = 1';
    if (search) {
      sql += ` and (upper(name) LIKE '%${search.toLocaleUpperCase()}%' or upper(surname) LIKE '%${search.toLocaleUpperCase()}%')`;
    }

    const dbName = await this.getDbName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql
    }).then((response: capSQLiteValues) => {
      let students: Student[] = [];
      for (let index = 0; index < response.values.length; index++) {
        const row = response.values[index];
        let student = row as Student;
        students.push(student);
      }
      return Promise.resolve(students);
    }).catch(error => Promise.reject(error))

  }

  async updateStudent(student: Student) {
    let sql = 'UPDATE students SET name=?, surname=?, email=?, phone=? WHERE id=?';

    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            student.name,
            student.surname,
            student.email,
            student.phone,
            student.id
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({
          database: dbName
        });
      }
      return changes;
    })
  }

  async deleteStudent(student: Student) {
    let sql = 'UPDATE students SET active=0 WHERE id=?';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            student.id
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({
          database: dbName
        });
      }
      return changes;
    })
  }

  async createClass(c: Class) {
    let sql = 'INSERT INTO class (date_start, date_end, id_student, price) VALUES (?,?,?,?)';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            c.date_start,
            c.date_end,
            c.id_student,
            c.price
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({
          database: dbName
        });
      }
      return changes;
    })
  }

  async getClasses(filter?: Filter) {
    let sql = 'SELECT * FROM class WHERE active=1 ';
    if(filter){
      if(filter.date_start){
        sql += ` and date_start >= '${filter.date_start}'`;
      }
      if(filter.date_end){
        sql += ` and date_end <= '${filter.date_end}'`;
      }
      if(filter.id_student){
        sql += ` and id_student = '${filter.id_student}'`;
      }
    }
    sql += " ORDER BY date_start,date_end";
    const dbName = await this.getDbName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql
    }).then((response: capSQLiteValues) => {
      let classes: Class[] = [];
      for (let index = 0; index < response.values.length; index++) {
        const row = response.values[index];
        const c: Class = row as Class;
        classes.push(c);
      }
      return Promise.resolve(classes);
    }).catch(err => Promise.reject(err))
  }

  async updateClass(c: Class) {
    let sql = 'UPDATE class SET date_start=?, date_end=?, id_student=?, price=? WHERE id=?';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            c.date_start,
            c.date_end,
            c.id_student,
            c.price,
            c.id
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({
          database: dbName
        });
      }
      return changes;
    })

  }

  async deleteClass(c: Class){
    let sql = 'UPDATE class SET active=0 WHERE id=?';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            c.id
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({
          database: dbName
        });
      }
      return changes;
    })
  }

  async getPayments(filter?: Filter) {
    let sql = 'SELECT p.* FROM payment p, class c WHERE p.id_class = c.id AND c.active=1';
    if (filter && filter.paid != null) {
      if (filter.paid) {
        sql += ' and p.paid = 1';
      } else {
        sql += ' and p.paid = 0';
      }
      if (filter.date_start) {
        if (filter.paid) {
          sql += ` and p.date >= '${filter.date_start}'`;
        } else {
          sql += ` and c.date_start >= '${filter.date_start}'`;
        }
      }

      if (filter.date_end) {
        if (filter.paid) {
          sql += ` and p.date <= '${filter.date_end}'`;
        } else {
          sql += ` and c.date_end <= '${filter.date_end}'`;
        }
      }

      if (filter.id_student) {
        sql += ` and c.id_student = ${filter.id_student}`;
      }

    }
    sql += " ORDER BY p.date";
    const dbName = await this.getDbName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql
    }).then( (response: capSQLiteValues)=> {
     let payments: Payment[] = [];
      for (let index = 0; index < response.values.length; index++) {
        const row = response.values[index];
        let payment: Payment = row as Payment;
        payments.push(payment);
      }
      return Promise.resolve(payments);
    }).catch(err => Promise.reject(err))
  }


  async createPayment(payment: Payment) {
    let sql = 'INSERT INTO payment(date, id_class, paid) VALUES(?,?,?)';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            payment.date,
            payment.id_class,
            payment.paid
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({
          database: dbName
        });
      }
      return changes;
    })
  }


}
