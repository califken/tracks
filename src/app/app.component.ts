import { Component, VERSION } from '@angular/core';
import { AuthService } from './user/services/auth.service';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  uid;
  constructor(public authservice: AuthService) {
    this.uid = authservice.getUserIDAsync();
  }
}
