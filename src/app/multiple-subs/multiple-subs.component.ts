/*
This example demonstrates that if you use a RxJS pipe to do some additional
computation based on an updated value upstream, that computation will be
done once for each subscriber that is subscribed to the pipe. This is
usually not something that you want, especially if the computation is demanding.
*/

import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-multiple-subs',
  templateUrl: './multiple-subs.component.html',
  styleUrls: ['./multiple-subs.component.css']
})
export class MultipleSubsComponent {

  counter: number = 1;
  subject = new BehaviorSubject<number>(this.counter++);
  obs$: Observable<number>;
  log: string[] = [];

  constructor() {
      // We set up the pipe here:
      this.obs$ = this.subject.pipe(
          // The code within the switchMap will be executed once
          // for each subscriber we have for `obs$`.
          // (We have 5 subscribers, see `multiple-subs.component.html`)
          // In addition to switchMap, this happens for map, tap, and most(all?) other
          // operators you throw in a pipe.
          switchMap(num => {
              // Make a call to calculate, pretend calculate is
              // doing something taxing...
              return this.calculate(num)
          }),
          // making use of the `shareReplay` operator here
          // fixes this, however, `shareReplay` comes with its own
          // gotcha. See `share-replay-cleanup` and `share-replay-clean-two`.
      )
  }

  async calculate(x: number): Promise<number> {
      // pushing a line to the log to display it in the UI
      this.log.push("calculating for " + x);
      // This could potentially make a request to an api
      // or simple do some local data crunching.
      return x * x;
  }

  emitEvent() {
      this.subject.next(this.counter++);
  }

}
