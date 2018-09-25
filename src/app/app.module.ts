import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Camera } from '@ionic-native/camera';
import { NgProgressModule } from '@ngx-progressbar/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AngularFireModule } from 'angularfire2'
import { AngularFireDatabaseModule} from 'angularfire2/database'

export const config = {
  apiKey: "AIzaSyBr2_AsqmeqE60z4gHmouEDUkVbcf63ErM",
  authDomain: "ionic-tesseract.firebaseapp.com",
  databaseURL: "https://ionic-tesseract.firebaseio.com",
  projectId: "ionic-tesseract",
  storageBucket: "ionic-tesseract.appspot.com",
  messagingSenderId: "933395206162"
}
@NgModule({
  declarations: [
    MyApp,
    HomePage,
  ],
  imports: [
    BrowserModule,
    AngularFireModule,
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    IonicModule.forRoot(MyApp),
    NgProgressModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,Camera,
    Base64ToGallery,
     AndroidPermissions,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
