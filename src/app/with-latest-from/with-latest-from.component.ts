import { of, Subject, Observable } from 'rxjs'; 
import { map, withLatestFrom, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-with-latest-from',
  templateUrl: './with-latest-from.component.html',
  styleUrls: ['./with-latest-from.component.css']
})
export class WithLatestFromComponent implements OnInit {
  output$: Observable<number>;
  source1$: Subject<number>;
  source2$: Subject<number>;
  constructor() { }

  ngOnInit() {
    this.source1$ = new Subject<number>();
    this.source2$ = new Subject<number>();

    this.output$ = this.source1$.pipe(
      withLatestFrom(this.source2$),
      switchMap(([one, two]) => {
        return of(one + two);
      })
    );

  }

}
