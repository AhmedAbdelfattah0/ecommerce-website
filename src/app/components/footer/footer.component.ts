import { Component } from '@angular/core';
import { BaseComponent } from '../../common/components/base/base.component';

@Component({
  selector: 'app-footer',
  imports: [BaseComponent.materialModules],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
