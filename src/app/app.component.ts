import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Platform} from "@ionic/angular";
import {Device} from "@capacitor/device";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public isWeb: boolean;

  constructor(
    private platform: Platform,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('es');
    this.initApp();
  }

  initApp() {
    this.platform.ready().then( async () => {

      const language = await Device.getLanguageCode();
      const  info = await Device.getInfo();

      this.isWeb = info.platform === 'web';

      if (language.value) {
        this.translate.use(language.value.slice(0,2));
      }

    } )
  }

}
