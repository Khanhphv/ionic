import { Component, ViewChild, Renderer } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import * as Tesseract from 'tesseract.js'
import { Platform } from 'ionic-angular'
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { AngularFireDatabase } from 'angularfire2/database'
import { Observable } from 'rxjs/Observable';
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
  show: boolean = true;
  base64Data: any;
  canvasOut: any;
  storage: any

  @ViewChild('layout') canvasRef;
  @ViewChild('output') canvasOutPut;
  canvasIn: any;
  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    public platform: Platform,
    public render: Renderer,
    private base64ToGallery: Base64ToGallery,
    private androidPermissions: AndroidPermissions,
    private loadingController: LoadingController,
    public database: AngularFireDatabase

  ) {
    this.platform.ready().then(() => {
      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA]);
      this.getDataBase()
    })

  }
  getDataBase() {
    this.database.list("template").valueChanges().subscribe(data => {
      this.presentLoadingDefault()
      this.storage = data
      console.log(this.storage)
    })
  }

  ngAfterViewInit() {
    this.canvasOut = this.canvasOutPut.nativeElement;
    this.canvasIn = this.canvasRef.nativeElement
  }

  // get picture on canvas
  getImg(image) {
    if (image) {
      let context = this.canvasIn.getContext('2d');
      let source = new Image();
      source.crossOrigin = 'Anonymous';
      source.onload = () => {
        this.width = source.width;
        this.height = source.height;
        this.canvasIn.width = source.width;
        this.canvasIn.height = source.height;
        // canvas.height = this.dodai *3 /4; 
        // canvas.width =  this.dodai ;
        context.drawImage(source, 0, 0);
        // image = this.canvasRef.toDataURL();
        // return this.downScaleCanvas(canvas, 0.09)
      };
      source.src = image;
      this.test()
    }
  }
  // end get picture on canvas


  test() {
    let firstOption = this.storage[0]
    let x: any
    let y: any;
    let z: any;
    let t: any;
    let element = firstOption.elememts[0]
    console.log(element)
    x = element.srcX1;
    y = element.srcX2;
    z = element.srcY2;
    t = element.srcY3;
    

    let context = this.canvasOut.getContext('2d');
    let image = new Image();
    image.crossOrigin = 'Anonymous'
    image.onload = () => {
      var sourceX = x;
      var sourceY = y;
      var sourceWidth = z - x;
      var sourceHeight = t - y;
      var destWidth = sourceWidth;
      var destHeight = sourceHeight;
      this.canvasOut.width = image.width
      this.canvasOut.height = image.height
      var destX = this.canvasOut.width / 2 - destWidth / 2;
      var destY = this.canvasOut.height / 2 - destHeight / 2;
      context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
    }
    image.src = this.selectedImage
    this.base64Data = this.canvasOut.toDataURL("image/png")
    this.base64ToGallery.base64ToGallery(this.base64Data).then(
      res => alert("success"),
      err => alert(this.base64Data)
    );
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
  presentLoadingDefault() {
    let loading = this.loadingController.create({
      content: 'Please wait...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 5000);
  }

}