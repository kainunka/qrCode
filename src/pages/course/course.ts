import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import axios from 'axios'
import _ from 'lodash'

const serverCourse = "http://qrcode-app.000webhostapp.com/course.php"
const serverUser = "http://qrcode-app.000webhostapp.com/users.php"

@IonicPage()
@Component({
  selector: 'page-course',
  templateUrl: 'course.html',
})
export class CoursePage {
  roomName =  "";
  roomID = null;
  contacts = []
  userData = []

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.roomName = this.navParams.get('name')
    this.roomID = this.navParams.get('id')
    this.callDataCouse(this.roomID)
    this.callUser()
  }

  // ฟังชั่นเรียกข้อมูลรายชื่อห้องวิชาในห้่องเรียนทั้งหมด
  callDataCouse = (room_id) => {
    let bodyFormData = new FormData();
    bodyFormData.set('request', 'get_id_room');
    bodyFormData.set('room_id', room_id);
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
      console.log(response)
      if (response.data.result == 1) {
        this.contacts = response.data.data
      }
    })
    .catch((response) => {
        console.log(response)
        this.contacts = response
    });

  }

  callUser = () => {
    let bodyFormData = new FormData();
    bodyFormData.set('request', 'get');
    let data = {
      method: 'post',
      url: serverUser,
      data: bodyFormData,
      config: { 
        headers: {
          'Content-Type': 'multipart/form-data' 
        }
      }
    }

    axios(data).then((response) => {
      // console.log(response)
      if (response.data.result == 1) {
        this.userData = response.data.data
        // console.log(this.userData)
      }
    })
    .catch((response) => {
        console.log(response)
        this.userData = response
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CoursePage');
  }


  add_course = () => {
    this.navCtrl.push("AddCoursePage", {
      roomID: this.roomID,
      callback: this.getDataCourse
    })
  }

  goToPerson = (name, id) => {
    this.navCtrl.push("PersonPage", {
      name: name,
      id: id,
      user: this.userData
    })
  }

  getDataCourse = (dataCourse) => {
    return new Promise((resolve, reject) => {
      this.contacts.push(dataCourse)
      resolve()
    })
  }

  // ฟังชั่นลบ รายวิชา
  callRemoveCourse = (id) => {
    let bodyFormData = new FormData();
    bodyFormData.set('request', 'remove');
    bodyFormData.set('course_id', id);
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
        let keyRemove = _.findIndex(this.contacts, {'course_id': id})
        if (keyRemove) {
          this.contacts.splice(keyRemove, 1)
        }
      }
    })
    .catch((response) => {
        console.log(response)
        this.contacts = response
    });

  }

  removeCourse = (id) => {
    this.callRemoveCourse(id)
  }

  viewQrcode = (id, name, end_time) => {
    this.navCtrl.push("ViewQrcodePage", {
      qrcode: id,
      name: name,
      end_time: end_time
    })
  }

}
