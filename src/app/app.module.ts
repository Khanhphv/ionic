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
import { ProcessPage } from '../pages/process/process'
import { ShareDataProvider } from '../providers/share-data/share-data';
export const config = {
  apiKey: "AIzaSyA48CcyJ2vWU8q5ZRfeuWRoVXlxX8QR1Ko",
  authDomain: "ionic-tesseract-2dd97.firebaseapp.com",
  databaseURL: "https://ionic-tesseract-2dd97.firebaseio.com",
  projectId: "ionic-tesseract-2dd97",
  storageBucket: "ionic-tesseract-2dd97.appspot.com",
  messagingSenderId: "500471966297"
}
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProcessPage
  ],
  imports: [
    BrowserModule,
    AngularFireModule,
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    IonicModule.forRoot(MyApp),
    NgProgressModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProcessPage

  ],
  providers: [
    StatusBar,
    SplashScreen,Camera,
    Base64ToGallery,
     AndroidPermissions,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ShareDataProvider
  ]
})
export class AppModule {}
