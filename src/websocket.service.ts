import { Injectable } from '@angular/core';
import { RxStomp, StompHeaders } from '@stomp/rx-stomp';
import { map, merge, Observable, Subject, takeUntil } from 'rxjs';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private readonly rxStomp = new RxStomp();
  private readonly deactivate$ = new Subject<void>();

  activate(connectHeaders: StompHeaders): void {
    if (this.rxStomp.active) return;

    this.rxStomp.configure({
      brokerURL: `ws://${environment.apiUrl}/shoots`,
      reconnectDelay: 200,
      connectHeaders,
    });

    this.rxStomp.activate();
    this.deactivate$.subscribe(() => this.rxStomp.deactivate());
  }

  deactivate(): void {
    this.deactivate$.next();
  }

  getTopic<T>(destination: string, headers?: StompHeaders): Observable<T> {
    return this.rxStomp.watch(destination, headers).pipe(
      map((frame) => JSON.parse(frame.body)),
      takeUntil(merge(this.deactivate$, this.rxStomp.stompErrors$)),
    );
  }

  send<T>(destination: string, body: T, headers?: StompHeaders): void {
    return this.rxStomp.publish({
      destination,
      body: JSON.stringify(body),
      headers,
    });
  }
}
