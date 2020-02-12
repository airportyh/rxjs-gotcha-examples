import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

interface User {
    username: string;
    email: string;
}

@Component({
  selector: 'app-user-details',
  template: `
  <ng-container *ngIf="userDetails$ | async as user">
      Username: {{ user.username }}
      Email: {{ user.email }}
  </ng-container>`
})
export class UserDetailsComponent {
    @Input() userDetails$: Observable<User>;
}
