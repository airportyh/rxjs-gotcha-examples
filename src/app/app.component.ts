import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
}
