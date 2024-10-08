import { Injectable } from '@angular/core';
import {Device} from "@capacitor/device";
import {CapacitorSQLite} from "@capacitor-community/sqlite";
import {AlertController} from "@ionic/angular";
import {Preferences} from "@capacitor/preferences";

@Injectable({
  providedIn: 'root'
})
export class SqliteManagerService {

  public isWeb: boolean;

  private DB_SETUP_KEY = 'first_db_setup';

  constructor(
    private alertController: AlertController
  ) {
    this.isWeb = false;
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

      } else {

      }
    }

  }

}
