import { Injectable } from '@angular/core';

import {BehaviorSubject, Observable } from 'rxjs';
@Injectable()
export class GlobalMediaControlService {
  playControlSubject: BehaviorSubject<any>;
  constructor() {
     this.playControlSubject = new BehaviorSubject<any>('ready');
    this.playControlSubject.next('ready');
    this.playControlSubject.subscribe(console.log);
  }
}
