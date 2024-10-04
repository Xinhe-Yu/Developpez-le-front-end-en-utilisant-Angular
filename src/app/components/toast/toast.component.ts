import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorMessageService } from 'src/app/core/services/error-message.service';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgIf],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnInit {
  errorMessage: string | null = null;
  private subscription: Subscription | undefined;

  constructor(private errorMessageService: ErrorMessageService) { }

  ngOnInit(): void {
    this.subscription = this.errorMessageService.error$.subscribe(message => {
      this.errorMessage = message;
      if (message) {
        setTimeout(() => this.errorMessageService.clearError(), 5000)
      }
    })
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
