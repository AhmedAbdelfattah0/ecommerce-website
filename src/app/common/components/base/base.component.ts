import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
 import { MatListModule } from '@angular/material/list';
import '@ingka/icon-webc';


@Injectable()

export class BaseComponent implements OnDestroy {
  ngUnSubscribe = new Subject<void>();
  static materialModules = [
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
     MatListModule
  ];
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }

}
