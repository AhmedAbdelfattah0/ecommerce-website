import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { CustomizationService } from '../../services/customization/customization.service';
import { MaterialOption, AddOnOption, CustomOrder, CustomOrderItem } from '../../models/order-customization';
import { HeroComponent } from '../../components/hero/hero.component';

@Component({
  selector: 'app-order-customization',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatRadioModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    HeroComponent
  ],
  templateUrl: './order-customization.component.html',
  styleUrl: './order-customization.component.scss'
})
export class OrderCustomizationComponent implements OnInit {
  // Current step in the customization process
  currentStep = 0;

  // Loading states
  isLoading = false;
  isSubmitting = false;

  // Form groups for each step
  itemsForm!: FormGroup;
  customizationForm!: FormGroup;
  customerInfoForm!: FormGroup;

  // Available options for material and add-ons
  materials: MaterialOption[] = [];
  addOns: AddOnOption[] = [];

  // File uploads
  uploadedImages: { [itemIndex: number]: File[] } = {};
  uploadedImagePreviews: { [itemIndex: number]: string[] } = {};

  // Min date for appointment picker (today)
  minDate = new Date();

  // Getters for form arrays
  get items(): FormArray {
    return this.itemsForm.get('items') as FormArray;
  }

  /**
   * Get the materials FormArray for a given item
   */
  getMaterialsArray(itemGroup: AbstractControl): AbstractControl[] {
    return (itemGroup.get('materials') as FormArray).controls;
  }

  /**
   * Get the add-ons FormArray for a given item
   */
  getAddOnsArray(itemGroup: AbstractControl): AbstractControl[] {
    return (itemGroup.get('addOns') as FormArray).controls;
  }

  constructor(
    private fb: FormBuilder,
    private customizationService: CustomizationService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    // Initialize forms
    this.initForms();
  }

  ngOnInit(): void {
    this.isLoading = true;

    // Load materials and add-ons
    Promise.all([
      this.loadMaterials(),
      this.loadAddOns()
    ]).finally(() => {
      this.isLoading = false;
    });
  }

  /**
   * Initialize all forms
   */
  private initForms(): void {
    // Items form with at least one item
    this.itemsForm = this.fb.group({
      items: this.fb.array([this.createItemForm()])
    });

    // Customization options form
    this.customizationForm = this.fb.group({
      deliveryMethod: ['standard', Validators.required],
      assemblyOption: ['pre-assembled', Validators.required]
    });

    // Customer information form
    this.customerInfoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-\(\)]{7,15}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  /**
   * Create a form group for a new item
   */
  createItemForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: [''],
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      notes: [''],
      materials: this.fb.array([this.createMaterialForm()]),
      addOns: this.fb.array([]),
      dimensions: this.fb.group({
        hasDimensions: [true],
        width: ['', Validators.required],
        height: ['', Validators.required],
        depth: ['', Validators.required],
        unit: ['cm', Validators.required]
      }),
      appointment: this.fb.group({
        date: [''],
        timeSlot: [''],
        address: [''],
        notes: ['']
      }),
      engraving: this.fb.group({
        hasEngraving: [false],
        text: ['']
      }),
      referenceImages: [[]]
    });
  }

  /**
   * Create a form group for a material
   */
  createMaterialForm(): FormGroup {
    return this.fb.group({
      materialId: ['', Validators.required],
      color: [''],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  /**
   * Create a form group for an add-on
   */
  createAddOnForm(addOnId: number): FormGroup {
    return this.fb.group({
      addOnId: [addOnId, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  /**
   * Add a new item to the order
   */
  addItem(): void {
    this.items.push(this.createItemForm());
  }

  /**
   * Remove an item from the order
   */
  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);

      // Remove any uploaded images for this item
      if (this.uploadedImages[index]) {
        delete this.uploadedImages[index];
        delete this.uploadedImagePreviews[index];
      }
    } else {
      this.snackBar.open('Order must contain at least one item', 'OK', {
        duration: 3000
      });
    }
  }

  /**
   * Duplicate an item in the order
   */
  duplicateItem(index: number): void {
    const itemToDuplicate = this.items.at(index) as FormGroup;
    const itemValue = itemToDuplicate.value;

    // Create a new item with the same values
    const newItem = this.createItemForm();
    newItem.patchValue({
      name: `${itemValue.name} (Copy)`,
      description: itemValue.description,
      quantity: itemValue.quantity,
      notes: itemValue.notes,
      dimensions: {
        hasDimensions: itemValue.dimensions.hasDimensions,
        width: itemValue.dimensions.width,
        height: itemValue.dimensions.height,
        depth: itemValue.dimensions.depth,
        unit: itemValue.dimensions.unit
      },
      engraving: {
        hasEngraving: itemValue.engraving.hasEngraving,
        text: itemValue.engraving.text
      }
    });

    // Add materials to the new item
    const materialsArray = newItem.get('materials') as FormArray;
    materialsArray.clear(); // Remove the default material

    const originalMaterials = itemToDuplicate.get('materials') as FormArray;
    originalMaterials.controls.forEach(material => {
      const materialValue = material.value;
      const newMaterial = this.createMaterialForm();
      newMaterial.patchValue({
        materialId: materialValue.materialId,
        color: materialValue.color,
        quantity: materialValue.quantity
      });
      materialsArray.push(newMaterial);
    });

    // Add add-ons to the new item
    const addOnsArray = newItem.get('addOns') as FormArray;
    const originalAddOns = itemToDuplicate.get('addOns') as FormArray;
    originalAddOns.controls.forEach(addOn => {
      const addOnValue = addOn.value;
      const newAddOn = this.createAddOnForm(addOnValue.addOnId);
      newAddOn.patchValue({
        quantity: addOnValue.quantity
      });
      addOnsArray.push(newAddOn);
    });

    // Add the new item to the form
    this.items.push(newItem);
  }

  /**
   * Add a material to an item
   */
  addMaterial(itemIndex: number): void {
    const materialsArray = this.items.at(itemIndex).get('materials') as FormArray;
    materialsArray.push(this.createMaterialForm());
  }

  /**
   * Remove a material from an item
   */
  removeMaterial(itemIndex: number, materialIndex: number): void {
    const materialsArray = this.items.at(itemIndex).get('materials') as FormArray;
    if (materialsArray.length > 1) {
      materialsArray.removeAt(materialIndex);
    } else {
      this.snackBar.open('Item must have at least one material', 'OK', {
        duration: 3000
      });
    }
  }

  /**
   * Toggle an add-on for an item
   */
  toggleAddOn(itemIndex: number, addOn: AddOnOption): void {
    const addOnsArray = this.items.at(itemIndex).get('addOns') as FormArray;
    const existingIndex = addOnsArray.controls.findIndex(
      control => control.get('addOnId')?.value === addOn.id
    );

    if (existingIndex >= 0) {
      // Remove the add-on if it already exists
      addOnsArray.removeAt(existingIndex);
    } else {
      // Add the add-on if it doesn't exist
      addOnsArray.push(this.createAddOnForm(addOn.id));
    }
  }

  /**
   * Check if an add-on is selected for an item
   */
  isAddOnSelected(itemIndex: number, addOnId: number): boolean {
    const addOnsArray = this.items.at(itemIndex).get('addOns') as FormArray;
    return addOnsArray.controls.some(
      control => control.get('addOnId')?.value === addOnId
    );
  }

  /**
   * Toggle the dimensions section for an item
   */
  toggleDimensions(itemIndex: number, hasDimensions: boolean): void {
    const item = this.items.at(itemIndex) as FormGroup;
    const dimensionsGroup = item.get('dimensions') as FormGroup;
    const appointmentGroup = item.get('appointment') as FormGroup;

    if (hasDimensions) {
      // Use custom dimensions - make dimensions required and appointment optional
      dimensionsGroup.get('width')?.setValidators([Validators.required]);
      dimensionsGroup.get('height')?.setValidators([Validators.required]);
      dimensionsGroup.get('depth')?.setValidators([Validators.required]);

      appointmentGroup.get('date')?.clearValidators();
      appointmentGroup.get('timeSlot')?.clearValidators();
      appointmentGroup.get('address')?.clearValidators();

      // Reset appointment values
      appointmentGroup.get('date')?.setValue('');
      appointmentGroup.get('timeSlot')?.setValue('');
      appointmentGroup.get('address')?.setValue('');
      appointmentGroup.get('notes')?.setValue('');
    } else {
      // Schedule appointment - make appointment required and dimensions optional
      dimensionsGroup.get('width')?.clearValidators();
      dimensionsGroup.get('height')?.clearValidators();
      dimensionsGroup.get('depth')?.clearValidators();

      appointmentGroup.get('date')?.setValidators([Validators.required]);
      appointmentGroup.get('timeSlot')?.setValidators([Validators.required]);
      appointmentGroup.get('address')?.setValidators([Validators.required]);

      // Reset dimensions values
      dimensionsGroup.get('width')?.setValue('');
      dimensionsGroup.get('height')?.setValue('');
      dimensionsGroup.get('depth')?.setValue('');
    }

    // Update validity
    dimensionsGroup.get('width')?.updateValueAndValidity();
    dimensionsGroup.get('height')?.updateValueAndValidity();
    dimensionsGroup.get('depth')?.updateValueAndValidity();
    appointmentGroup.get('date')?.updateValueAndValidity();
    appointmentGroup.get('timeSlot')?.updateValueAndValidity();
    appointmentGroup.get('address')?.updateValueAndValidity();
    appointmentGroup.get('notes')?.updateValueAndValidity();
  }

  /**
   * Toggle the engraving section for an item
   */
  toggleEngraving(itemIndex: number, hasEngraving: boolean): void {
    const item = this.items.at(itemIndex) as FormGroup;
    const engravingGroup = item.get('engraving') as FormGroup;

    if (hasEngraving) {
      engravingGroup.get('text')?.setValidators([Validators.required]);
    } else {
      engravingGroup.get('text')?.clearValidators();
      engravingGroup.get('text')?.setValue('');
    }

    engravingGroup.get('text')?.updateValueAndValidity();
  }

  /**
   * Handle file upload for reference images
   */
  onFileSelected(event: Event, itemIndex: number): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];

      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        this.snackBar.open('Only JPEG, PNG, and GIF images are allowed', 'OK', {
          duration: 3000
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        this.snackBar.open('Image must be less than 5MB', 'OK', {
          duration: 3000
        });
        return;
      }

      // Initialize arrays if they don't exist
      if (!this.uploadedImages[itemIndex]) {
        this.uploadedImages[itemIndex] = [];
        this.uploadedImagePreviews[itemIndex] = [];
      }

      // Add file to uploads
      this.uploadedImages[itemIndex].push(file);

      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.uploadedImagePreviews[itemIndex].push(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Clear the input
      inputElement.value = '';
    }
  }

  /**
   * Remove a reference image
   */
  removeImage(itemIndex: number, imageIndex: number): void {
    if (this.uploadedImages[itemIndex] && this.uploadedImages[itemIndex].length > imageIndex) {
      this.uploadedImages[itemIndex].splice(imageIndex, 1);
      this.uploadedImagePreviews[itemIndex].splice(imageIndex, 1);
    }
  }

  /**
   * Load available materials from the service
   */
  private loadMaterials(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.customizationService.getMaterialOptions().subscribe(
        materials => {
          this.materials = materials;
          resolve();
        },
        error => {
          console.error('Error loading materials:', error);
          this.snackBar.open('Failed to load materials', 'OK', {
            duration: 3000
          });
          resolve();
        }
      );
    });
  }

  /**
   * Load available add-ons from the service
   */
  private loadAddOns(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.customizationService.getAddOnOptions().subscribe(
        addOns => {
          this.addOns = addOns;
          resolve();
        },
        error => {
          console.error('Error loading add-ons:', error);
          this.snackBar.open('Failed to load add-ons', 'OK', {
            duration: 3000
          });
          resolve();
        }
      );
    });
  }

  /**
   * Navigate to the next step
   */
  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.currentStep++;
    }
  }

  /**
   * Navigate to the previous step
   */
  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  /**
   * Validate the current step
   */
  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 0: // Items
        if (this.items.length === 0) {
          this.snackBar.open('Please add at least one item', 'OK', {
            duration: 3000
          });
          return false;
        }

        let valid = true;
        this.items.controls.forEach((itemControl, index) => {
          if (itemControl.invalid) {
            this.snackBar.open(`Item #${index + 1} has invalid fields`, 'OK', {
              duration: 3000
            });
            itemControl.markAllAsTouched();
            valid = false;
          }
        });

        return valid;

      case 1: // Customization options
        if (this.customizationForm.invalid) {
          this.snackBar.open('Please fill all required fields', 'OK', {
            duration: 3000
          });
          this.customizationForm.markAllAsTouched();
          return false;
        }
        return true;

      case 2: // Customer information
        if (this.customerInfoForm.invalid) {
          this.snackBar.open('Please fill all required fields', 'OK', {
            duration: 3000
          });
          this.customerInfoForm.markAllAsTouched();
          return false;
        }
        return true;

      default:
        return true;
    }
  }

  /**
   * Submit the order
   */
  submitOrder(): void {
    if (!this.validateAllSteps()) {
      return;
    }

    this.isSubmitting = true;
    const order = this.prepareOrderData();

    this.customizationService.submitOrder(order).pipe(
      finalize(() => this.isSubmitting = false)
    ).subscribe(
     {
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Order submitted successfully!', 'OK', {
            duration: 5000
          });
          this.resetForms();
          this.router.navigate(['/home']);
          // Reset the form or navigate to confirmation page
          // this.resetForms();
          // router.navigate(['/order-confirmation'], { queryParams: { orderId: response.orderId } });
        } else {
          this.snackBar.open('Failed to submit order', 'OK', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        console.error('Error submitting order:', error);
        this.snackBar.open('An error occurred while submitting the order', 'OK', {
          duration: 3000
        });
      }
     }
    );
  }

  /**
   * Save the customization for later
   */
  saveForLater(): void {
    this.isSubmitting = true;
    const order = this.prepareOrderData();

    this.customizationService.saveCustomizationForLater(order).pipe(
      finalize(() => this.isSubmitting = false)
    ).subscribe(
     {
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Customization saved successfully! You can access it later with code: ' +
            response.data?.saveCode, 'OK', {
            duration: 5000
          });
          this.resetForms();
          this.router.navigate(['/home']);
        } else {
          this.snackBar.open('Failed to save customization', 'OK', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        console.error('Error saving customization:', error);
        this.snackBar.open('An error occurred while saving the customization', 'OK', {
          duration: 3000
        });
      }
     }
    );
  }

  /**
   * Validate all steps before submission
   */
  private validateAllSteps(): boolean {
    // Save the current step
    const currentStep = this.currentStep;

    // Check each step
    for (let i = 0; i <= 2; i++) {
      this.currentStep = i;
      if (!this.validateCurrentStep()) {
        return false;
      }
    }

    // Restore the current step
    this.currentStep = currentStep;
    return true;
  }

  /**
   * Prepare the order data for submission
   */
  private prepareOrderData(): CustomOrder {
    // Map form values to the order model
    const orderItems  = this.items.controls.map(itemControl => {
      const item = itemControl.value;

      // Map materials
      const materials = (itemControl.get('materials') as FormArray).controls.map(materialControl => {
        const materialId = materialControl.get('materialId')?.value;
        const material = this.materials.find(m => m.id === materialId);

        return {
          materialId,
          materialName: material?.name || '',
          quantity: materialControl.get('quantity')?.value,
          colorHex: materialControl.get('color')?.value
        };
      });

      // Map add-ons
      const addOns = (itemControl.get('addOns') as FormArray).controls.map(addOnControl => {
        const addOnId = addOnControl.get('addOnId')?.value;
        const addOn = this.addOns.find(a => a.id === addOnId);

        return {
          addOnId,
          addOnName: addOn?.name || '',
          quantity: addOnControl.get('quantity')?.value
        };
      });

      // Create the item
      return {
        itemName: item.name,
        itemDescription: item.description,
        itemType: 'custom', // Default for custom orders
        quantity: item.quantity,
        notes: item.notes,
        materials,
        addOns: addOns,
        dimensions: item.dimensions.hasDimensions ? {
          width: item.dimensions.width,
          height: item.dimensions.height,
          depth: item.dimensions.depth,
          unit: item.dimensions.unit
        } : {},
        appointment: !item.dimensions.hasDimensions ? {
          date: item.appointment.date,
          timeSlot: item.appointment.timeSlot,
          address: item.appointment.address,
          notes: item.appointment.notes
        } : null,
        engraving: item.engraving.hasEngraving ? item.engraving.text : null,
        hasCustomDimensions: item.dimensions.hasDimensions,
        referenceImages: item.referenceImages
      };
    });

    // Create the order
    return {
      customerInfo: {
        name: this.customerInfoForm.get('name')?.value,
        email: this.customerInfoForm.get('email')?.value,
        phone: this.customerInfoForm.get('phone')?.value,
        address: this.customerInfoForm.get('address')?.value
      },
      items: orderItems as unknown as CustomOrderItem[],
      deliveryMethod: this.customizationForm.get('deliveryMethod')?.value,
      assemblyOption: this.customizationForm.get('assemblyOption')?.value,
      status: 'draft',
      orderDate: new Date()
    };
  }

  /**
   * Get the material by ID
   */
  getMaterial(materialId: number): MaterialOption | undefined {
    return this.materials.find(m => m.id === materialId);
  }

  /**
   * Get the add-on by ID
   */
  getAddOn(addOnId: number): AddOnOption | undefined {
    return this.addOns.find(a => a.id === addOnId);
  }

  /**
   * Reset all forms
   */
  resetForms(): void {
    // Clear items
    this.items.clear();
    this.addItem();

    // Reset customization form
    this.customizationForm.reset({
      deliveryMethod: 'standard',
      assemblyOption: 'pre-assembled'
    });

    // Reset customer form
    this.customerInfoForm.reset();

    // Reset step
    this.currentStep = 0;

    // Reset images
    this.uploadedImages = {};
    this.uploadedImagePreviews = {};
  }

  /**
   * Calculate whether to use light or dark text based on background color
   * for better contrast and readability
   */
  getContrastColor(hexColor: string): string {
    // If no color is provided, return black
    if (!hexColor || hexColor === '') {
      return '#000000';
    }

    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate luminance - a weighted average giving green more weight
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Use white text on dark backgrounds, black text on light backgrounds
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  /**
   * Set the material color from the color picker
   */
  setMaterialColor(materialGroup: AbstractControl, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.value) {
      materialGroup.get('color')?.setValue(input.value);
    }
  }
}
