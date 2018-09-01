import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from "@angular/forms"
import axios from 'axios'

const server = "http://qrcode-app.000webhostapp.com/users.php"

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  public signupForm : FormGroup;
  isSignup = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, public alertCtrl: AlertController, private toastCtrl: ToastController) {
  
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'ลงทะเบียน สำเร็จ',
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  callDataSignUp = (name, username, password) => {
      let bodyFormData = new FormData();
      bodyFormData.set('request', 'add');
      bodyFormData.set('name', name);
      bodyFormData.set('username', username);
      bodyFormData.set('password', password);
      bodyFormData.set('type', 'student');

      let data = {
        method: 'post',
        url: server,
        data: bodyFormData,
        config: { 
          headers: {
            'Content-Type': 'multipart/form-data' 
          }
        }
      }

      axios(data).then((response) => {
        console.log(response)
        if (response.data.result == 1) {
          this.navCtrl.pop()
          this.presentToast()
        } else {
          this.showAlert()
        }
      }).catch((response) => {
        console.log(response);
      })
  }

  showAlert = () => {
    const alert = this.alertCtrl.create({
      title: 'ลงทะเบียนไม่สำเร็จชื่อผู้ใช้ในระบบมีอยู่แล้ว',
      subTitle: '',
      buttons: ['OK']
    });
    alert.present();
  }

  signup = () => {
    this.callDataSignUp(this.signupForm.value.name, this.signupForm.value.username, this.signupForm.value.password)
  }

}
