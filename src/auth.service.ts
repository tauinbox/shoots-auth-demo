import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly ws = inject(WebsocketService);

  login(email: string, password: string): Observable<boolean> {
    return this.httpClient
      .post<string>(
        `http://${environment.apiUrl}/auth/login`,
        { email, password },
        { responseType: 'text' } as Record<string, unknown>,
      )
      .pipe(
        tap((jwt) => {
          this.ws.activate({ passcode: jwt });
        }),
        map(() => true),
        catchError(() => {
          this.ws.deactivate();
          return of(false);
        }),
      );
  }
}
