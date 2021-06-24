import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

import { of } from 'rxjs';

import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, first, map } from 'rxjs/operators';
export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  userData?: [];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  user$: Observable<User>;
  authState;
  constructor(public afauth: AngularFireAuth, public db: AngularFireDatabase) {
    this.user$ = this.afauth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.currentUserSubject = new BehaviorSubject<any>(user);
          this.currentUser = this.currentUserSubject.asObservable();
          return this.db.object(`users/${user.uid}`).valueChanges();
        } else {
          this.currentUserSubject = new BehaviorSubject<any>(null);
          return of(null);
        }
      })
    );
    this.afauth.authState.subscribe(authState => {
      this.authState = authState;
    });
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  getUserDisplayName(uid: string) {
    let displayName;
    let namepath = 'users/' + uid + '/displayName';
    console.log(namepath);
    let vc = this.db
      .object(namepath)
      .valueChanges()
      .subscribe(u => (displayName = u));
    console.log(displayName);
    return 'kenny';
  }

  async getUserIDAsync() {
    const user = await this.afauth.authState.pipe(first()).toPromise();
    console.log(user);
    return user.uid;
  }

  async googleSignin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afauth.signInWithPopup(provider);
    this.currentUserSubject.next(credential);
    console.log(this.currentUserValue);
    return this.updateUserData(credential.user);
  }

  async signOut() {
    await this.afauth.signOut();
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef = this.db.object(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    return userRef.update(data);
  }
  public usercontent(user, data) {
    // Sets user data to firestore on login
    const userRef = this.db.list(`users/${user.uid}/tracks`);

    return userRef.push(data);
  }
}
