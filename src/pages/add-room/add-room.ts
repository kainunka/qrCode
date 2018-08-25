import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import axios from 'axios'

const server = "http://qrcode-app.000webhostapp.com/room.php"

@IonicPage()
@Component({
  selector: 'page-add-room',
  templateUrl: 'add-room.html',
})
export class AddRoomPage {
  addRoom: any;
  nameRoom = null;
  callback: any;
  contacts: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.callback = this.navParams.get('callback')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRoomPage');
  }

  // ฟังชั่นเพิ่มห้องเรียน
  callAddRoom = (name) => {
    if (this.addRoom) {
      return Promise.resolve(this.addRoom)
    }

    return new Promise(resolve => {
      let bodyFormData = new FormData();
      bodyFormData.set('request', 'add');
      bodyFormData.set('name', name);

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
            let dataCallback = {
              room_id: response.data.room_id,
              name: response.data.name
            }
            this.callback(dataCallback).then(() => {
              this.navCtrl.pop()
            })
            
          } else {
            
          }
      })
      .catch((response) => {
          //handle error
          console.log(response);
      });
    })
  }

  add_room = () => {
    this.callAddRoom(this.nameRoom)
  }

}
