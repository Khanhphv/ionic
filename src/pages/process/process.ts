
import { Component, ViewChild, Renderer } from '@angular/core';
import { NavController, NavParams, LoadingController, Nav, Events } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import * as Tesseract from 'tesseract.js'
import { Platform } from 'ionic-angular'
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { AngularFireDatabase } from 'angularfire2/database'
import { AlertController } from 'ionic-angular';
declare var cv: any;
import * as $ from 'jquery'

@Component({
  selector: 'page-process',
  templateUrl: 'process.html',
})
export class ProcessPage {
  indexOfTemplate: any;
  selectedImage: string;
  imageText: string;
  canvasElement: any;
  public dodai: any;
  public width: any; height: any
  state: any
  @ViewChild('layout') canvasRef;
  // @ViewChild('output') canvasOutPut;
  canvasIn: any;
  // image = '../../assets//imgs/20180923_160126.jpg';
  show: boolean = true;
  // base64Data: any;
  canvasOut: any;
  storage: any
  arrayOfCanvas: any // array of  canvases
  subTitle: any;

  constructor(private camera: Camera,
    public platform: Platform,
    public render: Renderer,
    private base64ToGallery: Base64ToGallery,
    private androidPermissions: AndroidPermissions,
    private loadingController: LoadingController,
    public database: AngularFireDatabase,
    public navParams: NavParams,
    public event: Events,
    private alertCtrl: AlertController
  ) {
    this.event.subscribe('alo', data => {
      if (data.index == 'default') {
        console.log("default")
        this.state = 'default'

      } else {
        this.state = null
        this.indexOfTemplate = data.index;
        console.log(data)
        this.subTitle = this.storage[this.indexOfTemplate]['name']
        console.log(this.storage[this.indexOfTemplate])
      }

      // alert(data.)
    })
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
    // this.canvasOut = this.canvasOutPut.nativeElement;
    this.canvasIn = this.canvasRef.nativeElement
    // this.selectedImage = '../../assets/imgs/20180923_160126.jpg'
  }


  //take picture
  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      // targetWidth: 1200,
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.selectedImage = 'data:image/jpeg;base64,' + imageData;
      // this.getImg(this.selectedImage)

    }, (err) => {
      // alert("Something wrong")
    });
  }
  // end take picture

  //get picture from gallery
  getPicture(index) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      targetWidth: 1200,
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.selectedImage = 'data:image/jpeg;base64,' + imageData;
      // this.recognizeImage()
      this.getImg(this.selectedImage, index)

    }, (err) => {
    });
  }
  //end get picture from gallery


  // get picture on canvas
  getImg(image, index) {
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
      this.canvasImage(index)
    }
  }
  // end get picture on canvas

  //process image
  processImage(index) {
    if (this.state == 'default') {
      let obj = [
        { 'tên': 'Phạm Việt Khanh' },
        { 'ngày sinh': '13/10/1996' },
        { 'khoa': 'Công nghệ thông tin' },
        { 'ngành': 'Khoa học máy tính' }
      ]
    
      let alert = this.alertCtrl.create({
        title: 'Result',
        subTitle: JSON.stringify(obj),
        buttons: ['Dismiss']
      })
      alert.present();
    } else {
      this.canvasImage(index);
      this.saveImageToGallery(index)
    }

  }
  //end process

  canvasImage(index) {
    for (let i = 0; i < this.storage[index].elements.length; i++) {
      $(".canvas").append("<canvas id='canvasOut" + i + "'></canvas>")
    }
    // alert(this.arrayOfCanvas)
    console.log(this.selectedImage)
    for (let i = 0; i < this.storage[index].elements.length; i++) {
      // let firstOption = this.storage[0]
      let elementCanvas = $("#canvasOut" + i)[0]
      let element = this.storage[index].elements[i]
      let x: any
      let y: any;
      let z: any;
      let t: any;
      x = element.srcX1;
      y = element.srcX2;
      z = element.srcY1;
      t = element.srcY2;
      let context = elementCanvas.getContext('2d');
      let image = new Image();
      image.crossOrigin = 'Anonymous'
      image.onload = () => {
        var sourceX = x;
        var sourceY = y;
        var sourceWidth = z - x;
        var sourceHeight = t - y;
        var destWidth = sourceWidth;
        var destHeight = sourceHeight;
        elementCanvas.width = image.width
        elementCanvas.height = image.height
        var destX = elementCanvas.width / 2 - destWidth / 2;
        var destY = elementCanvas.height / 2 - destHeight / 2;
        context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
      }
      image.src = this.selectedImage
    }

  }

  saveImageToGallery(index) {
    for (let i = 0; i < this.storage[index].elements.length; i++) {
      console.log($("#canvasOut" + i)[0])
      let base64Data = ($("#canvasOut" + i)[0]).toDataURL("image/png")

      // start OCR 
      Tesseract.recognize(base64Data, {
        lang: 'vie',
      })
        .then(result => {
          // this.presentLoadingDefault()
          alert(result.text)
          this.imageText = result.text;
          $("#canvasOut" + i).remove()
        }), err => {
          alert(err)
        }
      //end OCR
        
      // //save to library
      // this.base64ToGallery.base64ToGallery(base64Data).then(
      //   res => alert("success"),
      //   err => alert(base64Data)
      // );
      // //end save 
    }

  }



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
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProcessPage');
  }

}
