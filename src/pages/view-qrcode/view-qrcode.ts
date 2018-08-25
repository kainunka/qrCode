import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-view-qrcode',
  templateUrl: 'view-qrcode.html',
})
export class ViewQrcodePage {
  createdCode = null;
  nameCourse = null;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.createdCode = this.navParams.get('qrcode')
    this.nameCourse = this.navParams.get('name')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewQrcodePage');
  }

}
