import { Component, Input } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../user/services/auth.service';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.css']
})
export class TracksComponent {
  uid;
  refPath: string;
  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
  constructor(public authservice: AuthService, public db: AngularFireDatabase) {
    this.getUserRef();
  }
  async getUserRef() {
    this.uid = await this.authservice.getUserIDAsync();
    this.refPath = `tracks/${this.uid}`;
    this.itemsRef = await this.db.list(this.refPath);
    // Use snapshotChanges().map() to store the key
    this.items = this.itemsRef
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      );
  }
  addItem(title: string, url: string) {
    this.itemsRef.push({ title: title, url: url, uid: this.uid });
    
  }
  updateItem(key: string, title: string, url: string) {
    this.itemsRef.update(key, { title: title, url: url });
  }
  deleteItem(key: string) {
    this.itemsRef.remove(key);
  }
  deleteEverything() {
    this.itemsRef.remove();
  }
}
