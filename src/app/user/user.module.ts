import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from './../../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/user/user.component';

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule // for firestore
  ],
  exports: [UserComponent],
  declarations: [LoginComponent, UserComponent]
})
export class UserModule {}
