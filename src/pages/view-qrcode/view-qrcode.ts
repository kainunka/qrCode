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
  end_time = null;
  timeCountDown = null;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.createdCode = this.navParams.get('qrcode')
    this.nameCourse = this.navParams.get('name')
    this.end_time = this.navParams.get('end_time')
    this.countDownTimer()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewQrcodePage');
  }

  countDownTimer = () => {
    let countDownDate = this.end_time;
    let x = setInterval(() => {
      let now = new Date().getTime();
      var distance = countDownDate - now;

      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.changeTime("เหลือเวลาอีก " + days + " วัน " + hours + " ชั่วโมง "
      + minutes + " นาที " + seconds + " วินาที ");

      if (distance < 0) {
        clearInterval(x);
        this.changeTime("หมดเวลาแล้ว");
      }
    } , 1000);
  }

  changeTime = (value) => {
    this.timeCountDown = value
  }

}
