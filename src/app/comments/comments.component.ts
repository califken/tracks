import { Component, Input } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../user/services/auth.service';
export interface Comment {
  id?: string,
  authorid: string,
  comment: string,
  when: string
}
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent {
  @Input() refpath: string;
  uid;
  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
  constructor(public authservice: AuthService, public db: AngularFireDatabase) {
    this.uid = this.authservice.getUserIDAsync();
    this.getUserRef();
  }

  async getUserRef() {
    let commentsRef = this.refpath + '/comments';
    this.itemsRef = await this.db.list(commentsRef);
    // Use snapshotChanges().map() to store the key
    this.items = this.itemsRef
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      );
  }
  async addItem(comment: string) {
    let uid = await this.authservice.getUserIDAsync();
    this.itemsRef.push({ 
      comment: comment, 
      authorid: uid,
    when: Date.now()
   });
  }
  updateItem(key: string, comment: string) {
    this.itemsRef.update(key, { comment: comment });
  }
  deleteItem(key: string) {
    this.itemsRef.remove(key);
  }
  deleteEverything() {
    this.itemsRef.remove();
  }
}
