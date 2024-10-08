import { Injectable } from '@angular/core';
import {AlertController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertController: AlertController,
    private translate: TranslateService
  ) { }

  async alertMessage(
    header: string,
    message: string
  ) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    })
    alert.present();
  }

  async alertConfirm(
    header: string,
    message: string,
    functionOk: Function
  ){
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: this.translate.instant('label.cancel'),
          role: 'cancel',
          handler: () => {}
        },
        {
          text: this.translate.instant('label.ok'),
          role: 'cofirm',
          handler: () => {
            functionOk();
          }
        }
      ]
    })
    await alert.present();
  }
}
