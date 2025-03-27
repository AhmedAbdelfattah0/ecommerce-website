import { ToasterService } from '../../services/toatser.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseComponent } from '../../common/components/base/base.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { FeaturesComponent } from '../../components/features/features.component';
import { ContactUsService } from '../../services/contacut-us/contact-us.service';
import { toasterCases } from '../../common/constants/app.constants';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    HeroComponent,
    FeaturesComponent
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
  animations: [
    // Animation for the info items
    trigger('infoItemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),

    // Animation for the contact form
    trigger('formAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),

    // Animation for form fields
    trigger('formFieldsAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger(100, [
            animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),

    // Button hover animation
    trigger('buttonHover', [
      state('initial', style({
        backgroundColor: '#B88E2F',
        transform: 'scale(1)'
      })),
      state('hovered', style({
        backgroundColor: '#a37b24',
        transform: 'scale(1.05)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      })),
      transition('initial <=> hovered', animate('0.2s ease-in-out'))
    ])
  ]
})
export class ContactUsComponent {
  contactForm: FormGroup;
  buttonState = 'initial';
  formFieldsState = true;

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
          this._toasterService.openToaster(toasterCases.MESSAGE_SENT);
          // Reset form with animation
          this.formFieldsState = false;
          setTimeout(() => {
            this.contactForm.reset();
            this.formFieldsState = true;
          }, 100);
        }
      })
    }
  }

  // Button hover methods
  onButtonMouseEnter() {
    this.buttonState = 'hovered';
  }

  onButtonMouseLeave() {
    this.buttonState = 'initial';
  }
}
