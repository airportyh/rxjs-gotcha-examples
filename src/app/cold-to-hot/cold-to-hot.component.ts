/*
This example demonstrates that it is possible to start an RxJS pipe
with a cold observable (usually a one and done stream), and then use
switchMap to switch it to being a hot observable (usually a continuous stream).
*/

import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-cold-to-hot',
  templateUrl: './cold-to-hot.component.html',
  styleUrls: ['./cold-to-hot.component.css']
})
export class ColdToHotComponent implements OnInit {
  log: string[] = [];
  constructor() { }
  subject = new BehaviorSubject(1);
  stuff$: Observable<number>;

  ngOnInit() {
      this.stuff$ = this.getStuff();
  }

  // Pretend this method made a request to an API and returned data.
  makeRequest(): Observable<number> {
      // this is a pretend API request that returns a number
      return Observable.create((observer) => {
          this.log.push("making request");
          setTimeout(() => observer.next(Math.random()), 200);
      })
  }

  getStuff(): Observable<number> {
      // we start the pipe with the result of makeRequest, which
      // is a cold observable that returns one one result and completes.
      return this.makeRequest().pipe(
          // what even makeRequest returns, we put that into subject as
          // its next value.
          tap((result) => {
            this.subject.next(result);
          }),
          // we use switchMap here to make the result of the pipe equate
          // to subject, which is a hot observable. This means that the returned
          // observable will be hot. Each time updateStuff() is called,
          // the subject gets a new value and the UI will update automatically.
          switchMap(() => {
              return this.subject
          })
      )
  }

  updateStuff() {
      this.getStuff().subscribe();
  }

}
