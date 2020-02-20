/*
This example demonstrates that an HTTP request observable (cold)
that gets issues does not necessarily issue only one request.
It also demonstrates a surprising way in which it could issue
multiple requests using the repeat (or retry) operator.
*/

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, from } from 'rxjs';
import { withLatestFrom, first, repeat, tap } from 'rxjs/operators';

@Component({
  selector: 'app-repeat',
  templateUrl: './repeat.component.html',
  styleUrls: ['./repeat.component.css']
})
export class RepeatComponent implements OnInit {
  private subject: Subject<any> = new Subject();
  constructor(private http: HttpClient) { }

  // This method returns a cold observable (it makes a request)
  // but that doesn't mean this request is only made once per call
  // to this method. That is because each new subscriber that subscribes
  // to it causes another request to be sent.
  //
  // Example:
  // const stuff$ = this.getStuff();
  // stuff$.subscribe();   // this issues one request
  // stuff$.subscribe();   // this issues another request
  getStuff(): Observable<any[]> {
      return this.http.get<any[]>("/assets/stuff.json");
  }

  // the following demonstrates how multiple requests can
  // be issued even if we are not visibly subscribing to
  // the cold observable more than once. This scenario happens
  // with the repeat operator (or one of its cousins, like retry).
  //
  // The repeat repeats every value within a stream. It only kicks
  // in when its upstream has completed, if not, the repeat operator
  // has no effect.
  // If you do:
  //
  // from([1, 2, 3])
  //   .pipe(repeat())
  //   .subscribe()
  //
  // that will go into an infinite loop and give you
  //    RangeError: Maximum call stack size exceeded
  // because each time the stream 1, 2, 3 ends, repeat restarts
  // the stream at 1, again, repeat...
  //
  // If you do:
  // const subject = new Subject();
  //
  // subject
  //   .pipe(repeat())
  //   .subscribe()
  //
  // and then any number of `subject.next(1)`s, the repeat will not
  // have a effect, because the subject stream has not completed.
  // but if you do `subject.complete()`, then it will repeat the
  // stream, and cause an infinite loop and Maximum call stack size exceeded.
  ngOnInit() {
      const stuff$ = this.getStuff();

      // And that brings us to this curiousity:
      // withLatestFrom(stuff$) combines a value from upstream with
      // the stuff$, which is a cold observable.
      // withLatestFrom has to subscribe to stuff$, which will cause
      // a request to be issued.
      // the first() operator will take one value from upstream, then complete
      // its resulting stream
      // when repeat sees that its upstream has been completed, it will
      // restart the entire pipe from the top, which incidentally, will cause
      // withLatestFrom to re-subscribe to stuff$, issuing another request.
      // WTF???
      //
      // the fact that repeat can affect something that is upstream of itself
      // is really surprising, I am interested in understand how it does this.
      // In general, keep in mind that when you come across the repeat operator
      // or one of its cousin retry, some serious black magic is being deployed.
      this.subject.pipe(
          // Each time you click the "Next" button, you'll see in the network
          // panel that a new request gets issued.
          withLatestFrom(stuff$),
          first(),
          repeat()
      ).subscribe();
  }

  next() {
      this.subject.next(1);
  }

}
