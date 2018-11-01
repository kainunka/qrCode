import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import axios from 'axios'
import _ from 'lodash'

const serverCourse = "http://qrcode-app.000webhostapp.com/join_room.php"

@IonicPage()
@Component({
  selector: 'page-person',
  templateUrl: 'person.html',
})
export class PersonPage {
  roomName =  "";
  roomID = null;
  contacts = []
  userData = []
  nameUser = []

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.roomName = this.navParams.get('name')
    this.roomID = this.navParams.get('id')
    this.userData = this.navParams.get('user')
    console.log(this.userData)
    this.callDataRoom(this.roomID)
  }

  callUserID = (user_id) => {
    let bodyFormData = new FormData();
    bodyFormData.set('request', 'get_id');
    bodyFormData.set('user_id', user_id);
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
    return data
  }

  // ฟังชั่นเรียกข้อมูลรายชื่อห้องวิชาในห้่องเรียนทั้งหมด
  callDataRoom = (course_id) => {
    console.log('course_id ', course_id)

    let bodyFormData = new FormData();
    bodyFormData.set('request', 'get_course');
    bodyFormData.set('course_id', course_id);
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
          if (!_.isUndefined(response.data.data) && Object.keys(response.data.data).length > 0) {
            _.map(response.data.data, (v, k) => {
              _.map(this.userData, (value, key) => {
                if (value.user_id == v.user_id) {
                  console.log('data')
                  this.nameUser.push(value)
                }
              })
            })
            console.log('this nameuser ', this.nameUser)
          }

         
        
       
        console.log(' this.contacts',  this.contacts)
      }
    })
    .catch((response) => {
        console.log(response)
        this.contacts = response
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CoursePage');
  }
}
