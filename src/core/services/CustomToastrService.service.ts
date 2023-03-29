import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class CustomToastrService {
  constructor(private toastr: ToastrService) {}

  public toastrSuccess(message: string) {
    this.toastr.success(message, 'Well done!', {
      closeButton: true,
      newestOnTop: false,
      progressBar: true,
      positionClass: 'toast-bottom-right',
      timeOut: 5000,
    });
  }

  public toastrError(message: string) {
    this.toastr.error(message, 'Oops', {
      closeButton: true,
      newestOnTop: false,
      progressBar: true,
      positionClass: 'toast-bottom-right',
      timeOut: 5000,
    });
  }
}
