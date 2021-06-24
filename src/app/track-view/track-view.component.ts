import { Component, Input, OnInit } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject
} from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
export interface Track {
  title: string;
  uid: string;
  url: string;
}
@Component({
  selector: 'app-track-view',
  templateUrl: './track-view.component.html',
  styleUrls: ['./track-view.component.css']
})
export class TrackViewComponent {
  @Input() uid: string;
  itemRef: AngularFireObject<any>;
  item: Observable<any>;
  trackid;
  authorid;
  refPath;
  track;
  constructor(public db: AngularFireDatabase, public route: ActivatedRoute) {}
  ngOnInit() {
    this.trackid = this.route.snapshot.paramMap.get('trackid');
    this.authorid = this.route.snapshot.paramMap.get('authorid');
    this.refPath = `tracks/${this.authorid}/${this.trackid}`;
    this.itemRef = this.db.object(this.refPath);
    // Use snapshotChanges().map() to store the key
    this.item = this.itemRef.valueChanges();
    this.item.subscribe(data => (this.track = data));
  }
}
