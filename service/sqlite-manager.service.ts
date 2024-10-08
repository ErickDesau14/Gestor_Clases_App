import { Injectable } from '@angular/core';
import {Device} from "@capacitor/device";
import {CapacitorSQLite, JsonSQLite} from "@capacitor-community/sqlite";
import {AlertController} from "@ionic/angular";
import {Preferences} from "@capacitor/preferences";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SqliteManagerService {

  public isWeb: boolean;
  private dbName: string;
  private DB_SETUP_KEY = 'first_db_setup';
  private DB_NAME_KEY = 'db_name';

  constructor(
    private alertController: AlertController,
    private httpClient: HttpClient
  ) {
    this.isWeb = false;
    this.dbName = '';
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
          message: 'Esta app no puede funcionar sin acceso a la base de datos',
          buttons: ['OK']
        });
        await alert.present();
      }
    } else if (info.platform == 'web') {
      this.isWeb = true;
      await  sqlite.infoWebStore();
    }

    async function setupDatebase() {
      const  dbSetupDone = await Preferences.get({key: this.DB_SETUP_KEY});

      if (!dbSetupDone.value) {
        this.downloadDatabase();
      } else {

        const dbName = await this.getDBName();
        await CapacitorSQLite.createConnection({ database: dbName });
        await CapacitorSQLite.open({ database: dbName });

      }
    }

  }

  downloadDatabase() {

    this.httpClient.get('assets/db/db.json').subscribe(async (jsonExport: JsonSQLite) => {
      const  jsonstring = JSON.stringify(jsonExport);
      const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });

      if (isValid.result) {
        this.dbName = jsonExport.database;
        await CapacitorSQLite.importFromJson({ jsonstring });
        await CapacitorSQLite.createConnection({ database: this.dbName });
        await CapacitorSQLite.open({ database: this.dbName });

        await Preferences.set({key: this.DB_SETUP_KEY, value: '1'});
        await Preferences.set({key: this.DB_NAME_KEY, value: this.dbName});

      }
    })

  }

  async getDBName() {
    if(!this.dbName) {
      const dbName = await Preferences.get({key: this.DB_NAME_KEY});
      this.dbName = dbName.value;
    }
    return this.dbName;
  }

}
