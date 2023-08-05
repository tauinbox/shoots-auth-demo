import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  private isAuthenticatedSubject = new Subject<boolean | undefined>();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  form = this.fb.group({
    email: '',
    password: '',
  });

  onSubmit() {
    const { email, password } = this.form.getRawValue();
    if (!email || !password) return;

    this.auth
      .login(email, password)
      .subscribe((res) => this.isAuthenticatedSubject.next(res));
  }
}
