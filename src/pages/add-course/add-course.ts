import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import axios from 'axios'

const serverCourse = "http://qrcode-app.000webhostapp.com/course.php"

@IonicPage()
@Component({
  selector: 'page-add-course',
  templateUrl: 'add-course.html',
})
export class AddCoursePage {
  qrData = null;
  createdCode = null;
  myDateStart = null;
  myDateEnd = null;
  roomID = null;
  callback: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.roomID = this.navParams.get("roomID")
    this.callback = this.navParams.get("callback")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCoursePage');
  }

  createCode = () => {
    this.createdCode = this.qrData
    console.log(this.createdCode)
  }

  // ฟังชั่น เพิ่มรายวิชา
  callAddDataCourse = (room_id, name, start_time, end_time) => {
    let bodyFormData = new FormData();
    bodyFormData.set('request', 'add');
    bodyFormData.set('room_id', room_id);
    bodyFormData.set('name', name);
    bodyFormData.set('start_time', start_time);
    bodyFormData.set('end_time', end_time);

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
      console.log(response.data)
      if (response.data.result == 1) {
        let dataCallback = {
          course_id: response.data.course_id,
          room_id: room_id,
          name: name,
          start_time: start_time,
          end_time: end_time
        }
        this.callback(dataCallback).then(() => {
          this.navCtrl.pop()
        })
      }
    })
    .catch((response) => {
        console.log(response)
    });
  }

  saveCourse = () => {
    if (this.qrData && this.myDateStart && this.myDateEnd) {
      this.callAddDataCourse(this.roomID, this.qrData, new Date(this.myDateStart).getTime(), new Date(this.myDateEnd).getTime())
    }
  }

}
