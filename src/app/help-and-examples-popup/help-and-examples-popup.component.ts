import { Component, OnInit, Input } from '@angular/core';
import { openCloseAnimation, openCloseShadeAnimation } from '../helpers/animation';

@Component({
  selector: 'app-help-and-examples-popup',
  templateUrl: './help-and-examples-popup.component.html',
  styleUrls: ['./help-and-examples-popup.component.scss'],
  animations: [
    openCloseAnimation,
    openCloseShadeAnimation,
  ]
})
export class HelpAndExamplesPopupComponent implements OnInit {

  @Input() isOpen = false;

  constructor() { }

  ngOnInit(): void {
  }

}
