import { Component } from '@angular/core';
import { NavController,  ModalController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  contacts = [{
    name: 'คณิตศาสตร์',
  }, {
    name: 'วิทยาศาสตร์',
  }, {
    name: 'ภาษาอังกฤษ'
  }, {
    name: 'พละศึกษา'
  }, {
    name: 'คอมพิวเตอร์'
  }, {
    name: 'แนะแนวอาชีพ'
  }]

  qrData = null;
  createdCode = null;
  scannedCode = null;

  constructor(public navCtrl: NavController,  public modalCtrl: ModalController, public qrScanner: BarcodeScanner) {

  }

  openModal(contacts) {
    console.log(contacts)

    let modal = this.modalCtrl.create("ModalPage", {
      name: contacts.name
    });
    modal.present();
  }

  showRoom = (contact) => {
    // this.navCtrl.push("RoomPage", contact)
  }

  createCode = () => {
    this.createdCode = this.qrData
  }

  scanCode = () => {
    console.log('scanning')

    this.qrScanner.scan().then((status) => {
        console.log('Scanned something', status.text);
        this.scannedCode = status.text
    }).catch((e: any) => {
      console.log('Error is : ', e)
    })
  }
}
