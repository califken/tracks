import { Component, Input } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { flatMap, map, tap, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.css']
})
export class TrackListComponent {
  @Input() uid: string;
  itemsRef: AngularFireList<any>;
  items;
  trackslist = [];
  trackslistObs;
  constructor(db: AngularFireDatabase) {
    this.itemsRef = db.list(`tracks`);
    // Use snapshotChanges().map() to store the key
    this.items = this.itemsRef.valueChanges();

    let oe = this.items.subscribe(data => {
      let obje = Object.entries(data);
      obje.forEach(ut => {
        let trks = Object.entries(ut[1]);
        trks.forEach(trk => {
          trk[1]['key'] = trk[0];
          trk[1]['viewurl'] = `/annotative-track-view/${trk[1]['uid']}/${
            trk[0]
          }`;
          this.trackslist.push(trk[1]);
        });
      });
    });
    this.trackslistObs = of(this.trackslist);
  }
}
