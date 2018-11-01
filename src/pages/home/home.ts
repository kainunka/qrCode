import { Component } from '@angular/core';
import { NavController,  ModalController, AlertController, ToastController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner'
import axios from 'axios'
import { Storage } from '@ionic/storage';
import { FormGroup, Validators, FormBuilder } from "@angular/forms"
import _ from 'lodash'

const server = "http://qrcode-app.000webhostapp.com/users.php"
const serverRoom = "http://qrcode-app.000webhostapp.com/room.php"
const serverCourse = "http://qrcode-app.000webhostapp.com/join_room.php"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public contacts: any;
  private loginForm : FormGroup;
  isLogin = true;
  dataLogin = {
    user_id: "",
    name: "",
    type: ""
  };

  public scanData = [];
  scannedCode = null;

  constructor(public navCtrl: NavController,  public modalCtrl: ModalController, public qrScanner: BarcodeScanner, public storage: Storage, private formBuilder: FormBuilder, public alertCtrl: AlertController, private toastCtrl: ToastController) {

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });


    // เช็คว่า เราล็อกอินไปแล้วรึยัง 
    storage.get('users_data').then((val) => {
      if (!val) {
        this.isLogin = false;
      } else {
        
        this.isLogin = true;
        this.dataLogin.user_id =  val.user_id
        this.dataLogin.name =  val.name
        this.dataLogin.type =  val.type

        if (this.dataLogin.type == "teacher") {
          this.callData()
        }
        
        if (this.dataLogin.type == "student") {
          this.callAllJoinRoom(this.dataLogin.user_id)
        }
      }
    });
  }

  // ฟังชั่นเรียกใช้หาก คนที่เข้ามาเป็นคุณครู
  callData = () => {
    if (this.contacts) {
      return Promise.resolve(this.contacts)
    }

    return new Promise(resolve => {
      let bodyFormData = new FormData();
      bodyFormData.set('request', 'get');
      let data = {
        method: 'post',
        url: serverRoom,
        data: bodyFormData,
        config: { 
          headers: {
            'Content-Type': 'multipart/form-data' 
          }
        }
      }
  
      axios(data).then((response) => {
          this.contacts = response.data.data
          resolve(this.contacts)
      })
      .catch((response) => {
          this.contacts = response
      });
    })

  }


  // ฟังชั่น เรียกใช้ตอนล็อกอิน
  callDataLogin = (username, password) => {
    if (this.isLogin) {
      return Promise.resolve(this.isLogin)
    }

    return new Promise(resolve => {
      let bodyFormData = new FormData();
      bodyFormData.set('request', 'check_login');
      bodyFormData.set('username', username);
      bodyFormData.set('password', password);

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
          //handle success
          console.log(response.data);
          if (response.data.result == 1) {
            this.storage.set('users_data', {
              user_id: response.data.user_id,
              name: response.data.name,
              type: response.data.type
            });
            this.dataLogin.user_id = response.data.user_id
            this.dataLogin.name = response.data.name;
            this.dataLogin.type = response.data.type

            this.isLogin = true

            if (this.dataLogin.type == "teacher") {
              this.callData()
            }
            if (this.dataLogin.type == "student") {
              this.callAllJoinRoom(this.dataLogin.user_id)
            }
          } else {
            this.isLogin = false
            this.showAlert()
          }
      })
      .catch((response) => {
          //handle error
          this.isLogin = false
          console.log(response);
      });
    })
  }

  // ฟังชั่นลบ ห้องเรียน
  callDataRemove = (room_id) => {
    let bodyFormData = new FormData();
    bodyFormData.set('request', 'remove');
    bodyFormData.set('room_id', room_id);

    let data = {
      method: 'post',
      url: serverRoom,
      data: bodyFormData,
      config: { 
        headers: {
          'Content-Type': 'multipart/form-data' 
        }
      }
    }

    axios(data).then((response) => {
        if (response.data.result == 1) {
          let keyRemove = _.findIndex(this.contacts, {'room_id': room_id})
          if (keyRemove) {
            this.contacts.splice(keyRemove, 1);
          }
        }
    })
    .catch((response) => {
        console.log(response);
    });
  }

  // ฟังชั่น แจ้งเตือนว่า username หรือ password ถูกต้องหรีือไม่
  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
      subTitle: '',
      buttons: ['OK']
    });
    alert.present();
  }

  presentToast = (value) => {
    let toast = this.toastCtrl.create({
      message: value,
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  // ฟังชั่นเรียกใช้เมิื่อแสกนคิวอาโค้ด จะไปหารายวิชาในฐานข้อมูล
  callJoinRoom = (course_id, user_id, time) => {
    let bodyFormData = new FormData();
    bodyFormData.set('request', 'course_add');
    bodyFormData.set('course_id', course_id);
    bodyFormData.set('user_id', user_id);
    bodyFormData.set('time', time);

    let data = {
      method: 'post',
      url: serverCourse,
      data: bodyFormData,
      config: { 
        headers: {
          'Content-Type': 'multipart/form-data' 
        }
      }
    }

    axios(data).then((response) => {
        if (response.data.result == 1) {
          this.scanData.push(response.data)
        } else {
          if (!_.isUndefined(response.data.status)) {
            this.presentToast(response.data.status)
          }
        }
    })
    .catch((response) => {
        console.log(response);
    });
  }

  // ฟังชั่นเรียกใช้่ ว่าเราเข้าห้องอะไรไปบ้างของ นักเรียนคนนั้นๆ
  callAllJoinRoom = (id) => {
    let bodyFormData = new FormData();
    bodyFormData.set('request', 'get_user');
    bodyFormData.set('user_id', id);

    let data = {
      method: 'post',
      url: serverCourse,
      data: bodyFormData,
      config: { 
        headers: {
          'Content-Type': 'multipart/form-data' 
        }
      }
    }

    axios(data).then((response) => {
        if (response.data.result == 1) {
          console.log(response.data);
          this.scanData = response.data.data
        }
    })
    .catch((response) => {
        console.log(response);
    });
  }


  // ฟังชั่น เรียกใช้ตอนแสกนคิวอาโึค้้่ด ใช้ได้กับบนมือถือเท่านั้น
  scanCode = () => {
    console.log('scanning')

    this.qrScanner.scan().then((status) => {
        console.log('Scanned something', status.text);
        this.scannedCode = status.text
        this.callJoinRoom(status.text, this.dataLogin.user_id, new Date().getTime())
    }).catch((e: any) => {
      console.log('Error is : ', e)
    })
  }

  // ฟังชั่น callback ที่ใช้เมื่อมีการร้องขอกลับจากหน้า room
  getDataRoom = (dataRoom) => {
    return new Promise((resolve, reject) => {
      this.contacts.push(dataRoom);
      resolve();
    });
  };


  add_room = () => {
    this.navCtrl.push("AddRoomPage", {
      callback: this.getDataRoom
    })
  }

  remove_room = (id) => {
    this.callDataRemove(id)
  }

  
  goToCouse = (name, id) => {
    this.navCtrl.push("CoursePage", {
      name: name,
      id: id
    })
  }

  // ฟังชั่นเรียกใช้เมื่อจะลบ การเข้าห้อง
  callRemoveJoinRoom = (id) => {
    let bodyFormData = new FormData();
    bodyFormData.set('request', 'remove');
    bodyFormData.set('join_id', id);

    let data = {
      method: 'post',
      url: serverCourse,
      data: bodyFormData,
      config: { 
        headers: {
          'Content-Type': 'multipart/form-data' 
        }
      }
    }

    axios(data).then((response) => {
        if (response.data.result == 1) {
          let removeItem = _.findIndex(this.scanData, {'join_id': id})
          if (removeItem) {
            this.scanData.splice(removeItem, 1)
          }
        } else {
          console.log(response.data)
        }
    })
    .catch((response) => {
        console.log(response);
    });
  }

  removeJoinRoom = (id) => {
    this.callRemoveJoinRoom(id)
  }

  login = () => {
    this.callDataLogin(this.loginForm.value.username, this.loginForm.value.password)
  }

  logout = () => {
    this.isLogin = false
    this.storage.remove("users_data")
  }

  signup = () => {
    this.navCtrl.push("SignupPage")
  }

}
