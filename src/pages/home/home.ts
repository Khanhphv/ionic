import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav, Events } from 'ionic-angular';
import { ProcessPage } from '../process/process';
import { AngularFireDatabase } from 'angularfire2/database'
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  storage: any;
  pages: Array<any>;
  rootPage = ProcessPage;
  state: any = 0
  // @ViewChild(Nav) nav: Nav;

  constructor(
    public database: AngularFireDatabase,
    public navCtrl: NavController,
    public event: Events
  ) {
    this.event.publish('alo', {
      'index': 'default',
      'obj': 'default'
    })
    this.getDataBase()

  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }
  getDataBase() {
    this.database.list("template").valueChanges().subscribe(data => {
      // this.presentLoadingDefault()
      if (!this.state) {
        this.default()
      }
      this.storage = data
      console.log(this.storage)
    })
  }
  open(index, obj) {
    // this.navCtrl.push(ProcessPage,index)
    this.state = 1
    this.event.publish('alo', {
      'index': index,
      'obj': obj
    })

  }
  default() {
    this.event.publish('alo', {
      'index': 'default',
      'obj': 'default'
    })
  }
  ionViewDidLoad() {
  }
}