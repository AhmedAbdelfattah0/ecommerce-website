import { Component } from '@angular/core';
import { BaseComponent } from '../../common/components/base/base.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [BaseComponent.materialModules,RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
