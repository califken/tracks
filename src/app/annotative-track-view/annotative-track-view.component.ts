import { Component, Input, OnInit } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject
} from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { WavesurferService } from '../wavesurfer.service';

@Component({
  selector: 'app-annotative-track-view',
  templateUrl: './annotative-track-view.component.html',
  styleUrls: ['./annotative-track-view.component.css']
})
export class AnnotativeTrackViewComponent implements OnInit {
  @Input() uid: string;
  itemRef: AngularFireObject<any>;
  item: Observable<any>;
  trackid;
  authorid;
  refPath;
  track;
  constructor(
    public ws: WavesurferService, public db: AngularFireDatabase, public route: ActivatedRoute) {
  this.trackid = this.route.snapshot.paramMap.get('trackid');
    this.authorid = this.route.snapshot.paramMap.get('authorid');
    this.refPath = `tracks/${this.authorid}/${this.trackid}`;
    this.itemRef = this.db.object(this.refPath);
    // Use snapshotChanges().map() to store the key
    this.item = this.itemRef.valueChanges();
    this.item.subscribe(data => (this.track = data));

     }

  ngOnInit() {
  }

}