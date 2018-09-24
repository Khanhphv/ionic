import { Component, ViewChild, Renderer } from '@angular/core';
import { NavController, ActionSheetController, LoadingController } from 'ionic-angular';
import { Camera, PictureSourceType, CameraOptions } from '@ionic-native/camera';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import * as Tesseract from 'tesseract.js'
import { Platform } from 'ionic-angular'
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { Diagnostic } from '@ionic-native/diagnostic';
declare var cv: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedImage: string;
  imageText: string;
  canvasElement: any;
  public dodai: any;
  public width: any; height: any
  // image = '../../assets//imgs/20180923_160126.jpg';
  @ViewChild('layout') canvasRef;
  @ViewChild('output') canvasOutPut;
  show: boolean = true;
  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    public platform: Platform,
    public render: Renderer,
    private base64ToGallery: Base64ToGallery,
    private androidPermissions: AndroidPermissions,
    private diagnostic: Diagnostic
    ) {

  }
  ngAfterViewInit() {
    this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.CAMERA);
  }

  // get picture on canvas
  getImg(image) {
    if (image) {
      let canvas = this.canvasRef.nativeElement;
      let context = canvas.getContext('2d');
      let source = new Image();
      source.crossOrigin = 'Anonymous';
      source.onload = () => {
        this.width = source.width;
        this.height = source.height;
        canvas.width = source.width;
        canvas.height = source.height;
        // canvas.height = this.dodai *3 /4; 
        // canvas.width =  this.dodai ;
        context.drawImage(source, 0, 0);
        image = this.canvasRef.toDataURL();
        // return this.downScaleCanvas(canvas, 0.09)
      };
      source.src = image;
    }
  }
  // end get picture on canvas


  test(x = 266, y = 1518, width = 3600, height = 400) {
    console.log(x);
    console.log(y);
    console.log(width);
    console.log(height);
    let canvas = this.canvasOutPut.nativeElement;
    let context = canvas.getContext('2d');
    let image = new Image();
    image.crossOrigin = 'Anonymous'
    image.onload = () => {
      var sourceX = x;
      var sourceY = y;
      var sourceWidth = width;
      var sourceHeight = height;
      canvas.width = this.dodai;
      canvas.height = this.dodai * 3 / 4;
      var destWidth = sourceWidth;
      var destHeight = sourceHeight;
      console.log(canvas.width);
      var destX = canvas.width / 2 - destWidth / 2;
      var destY = canvas.height / 2 - destHeight / 2;
      context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
      let jpegUrl = canvas.toDataURL()
    }
    image.src = this.selectedImage
  }

  //take picture
  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.selectedImage = 'data:image/jpeg;base64,' + imageData;
      this.getImg(this.selectedImage)

    }, (err) => {
      alert("Something wrong")
    });
  }
  // end take picture


  //get picture from gallery
  getPicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.selectedImage = 'data:image/jpeg;base64,' + imageData;
      // this.recognizeImage()
      this.getImg(this.selectedImage)
    }, (err) => {
    });
  }
  //end get picture from gallery

  start(ev) {
    let test = this.canvasRef.nativeElement.getBoundingClientRect();
    console.log(ev.touches[0].pageX - test.x)
    console.log(ev.touches[0].pageY - test.y)

  }

}