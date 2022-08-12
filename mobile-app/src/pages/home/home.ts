import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { GroceriesServiceProvider } from '../../providers/groceries-service/groceries-service';
import { InputDialogServiceProvider } from '../../providers/input-dialog-service/input-dialog-service';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  title = "Grocery";
  items = [];
  errorMessage : string;
  

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public dataService: GroceriesServiceProvider, public inputDialogService: InputDialogServiceProvider, public socialSharing: SocialSharing) {
    dataService.dataChanged$.subscribe((dataChanged: boolean) => {
      this.loadItems();
    });
  }

  ionViewDidLoad() {
    this.loadItems();
  }

  loadItems() {
    this.dataService.getItems().subscribe(
      items => this.items = items,
      error => this.errorMessage = <any>error
    );
  }

  removeItem(item, index) {
    const toast = this.toastCtrl.create({
      message: `${item.name} has been deleted`,
      duration: 3000
    });
    toast.present();

    this.dataService.removeItem(index);
  }

  editItem(item, index) {
    const toast = this.toastCtrl.create({
      message: `Editing item ${item.name}`,
      duration: 3000
    });
    toast.present();

    this.inputDialogService.showPrompt(item, index);

  }

  shareItem(item, index) {
    const toast = this.toastCtrl.create({
      message: `Sharing item ${item.name}`,
      duration: 3000
    });
    toast.present();

    let message = `Grocery Item - Name : ${item.name} - Quantity : ${item.quantity}`;
    let subject = "Shared via Groceries App";

    this.socialSharing.share(message, subject).then(() => {
      console.log("shared successfully");
      // Sharing via email is possible
    }).catch((error) => {
      console.error("Error while sharing ", error);
      // Sharing via email is not possible
    });
  }

  addItem() {
    this.inputDialogService.showPrompt();
  }
}
