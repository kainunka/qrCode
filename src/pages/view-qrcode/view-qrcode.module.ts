import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewQrcodePage } from './view-qrcode';
import { NgxQRCodeModule } from 'ngx-qrcode2'

@NgModule({
  declarations: [
    ViewQrcodePage,
  ],
  imports: [
    IonicPageModule.forChild(ViewQrcodePage),
    NgxQRCodeModule
  ],
})
export class ViewQrcodePageModule {}
