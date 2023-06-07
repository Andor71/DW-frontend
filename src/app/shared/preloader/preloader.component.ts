import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss'],
})
export class PreloaderComponent {
  constructor() {}
  @Input() loaderMessage: string = '';
  @Input() transparentBg: boolean = false;

  ngOnInit(): void {}
}
