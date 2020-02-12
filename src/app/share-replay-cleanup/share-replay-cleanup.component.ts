/*
This examples demonstrates a clean up bug in the shareReplay operator,
which is documented here: https://github.com/ReactiveX/rxjs/issues/3336.
*/

import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

@Component({
  selector: 'app-share-replay-cleanup',
  templateUrl: './share-replay-cleanup.component.html',
  styleUrls: ['./share-replay-cleanup.component.css']
})
export class ShareReplayCleanupComponent {

  log: string[] = [];
  constructor() {
      // interval(1000) fires once per second
      const source = interval(1000)
          .pipe(
              // this tap pushes a string "tick" into the log to be
              // displayed on the screen
              tap(() => this.log.push('tick')),
              shareReplay(1),
          );

      // subscribing to this stream causes activity to start,
      // and we start seeing the "tick"s on the screen
      const sub = source.subscribe(x => console.log(x));

      // but unsubscribing should cancel the activity upstream,
      // but it doesn't. We still see the "tick"s on the screen.

      // See `share-replay-clean-two` to see a scenario that
      // has bitten us once when using `switchMap` together
      // with the store.
      sub.unsubscribe();
  }

}
