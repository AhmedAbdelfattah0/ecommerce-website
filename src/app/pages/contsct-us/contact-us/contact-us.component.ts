import { ToasterService } from './../../../services/toatser.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseComponent } from '../../../common/components/base/base.component';
import { HeroComponent } from '../../../components/hero/hero.component';
import { FeaturesComponent } from '../../../components/features/features.component';
import { ContactUsService } from '../../../services/contacut-us/contact-us.service';
import { toasterCases } from '../../../common/constants/app.constants';

@Component({
  selector: 'app-contact-us',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, BaseComponent.materialModules, HeroComponent, FeaturesComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder, private _contactUsService: ContactUsService, private _toasterService:ToasterService) {
    window.scrollTo(0, 0);
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      message: ['', Validators.required]
    });
  }

  submitForm() {
    if (this.contactForm.valid) {
      this._contactUsService.sendMessage({...this.contactForm.value,date:new Date()}).subscribe({
        next:()=>{
          this._toasterService.openToaster(toasterCases.MESSAGE_SENT)
        }
      })
    }
  }
}
