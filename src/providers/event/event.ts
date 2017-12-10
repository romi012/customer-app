import { Injectable } from '@angular/core';
import firebase from 'firebase';
import {SMS} from "@ionic-native/sms";
import {ToastController} from "ionic-angular";

export class Post {
  ComplaintName: string;
  eventDate: string;
  PhoneNumber:string;
}
@Injectable()
export class EventProvider {
  public eventListRef: firebase.database.Reference;
  text :Post= {
    ComplaintName:'' ,
    PhoneNumber: "",
    eventDate:''

  };
  constructor(  private toastCtrl: ToastController,public sms: SMS) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.eventListRef = firebase
          .database()
          .ref(`/userProfile/${user.uid}/eventList`);
      }
    });
  }

  createEvent( text:Post): firebase.database.ThenableReference {
    return this.eventListRef.push({
      name:text.ComplaintName,
      date: text.eventDate,
      number:text.PhoneNumber
    });
  }

  getEventList(): firebase.database.Reference {
    return this.eventListRef;
  }

  getEventDetail(eventId: string): firebase.database.Reference {
    return this.eventListRef.child(eventId);
  }

  sendTextMessage(text:Post):void {
    //SMS.send('416123456', 'Hello world!');
    this.sms.send('03353305880', this.text.ComplaintName).then((result) => {
      let successToast = this.toastCtrl.create({
        message: "Text message sent successfully",
        duration: 3000
      })
      successToast.present();
    }, (error) => {
      let errorToast = this.toastCtrl.create({
        message: "Text message not sent. :(",
        duration: 3000
      })
      errorToast.present();
    });
  }

  /*addGuest(
   guestName: string,
   eventId: string,
   eventPrice: number,
   guestPicture: string = null
   ): PromiseLike<any> {
   return this.eventListRef
   .child(`${eventId}/guestList`)
   .push({ guestName })
   .then(newGuest => {
   this.eventListRef.child(eventId).transaction(event => {
   event.revenue += eventPrice;
   return event;
   });

   if (guestPicture != null) {
   firebase
   .storage()
   .ref(`/guestProfile/${newGuest.key}/profilePicture.png`)
   .putString(guestPicture, 'base64', {
   contentType: 'image/png'
   })
   .then(savedPicture => {
   this.eventListRef
   .child(`${eventId}/guestList/${newGuest.key}/profilePicture`)
   .set(savedPicture.downloadURL);
   });
   }
   });
   }*/
}
