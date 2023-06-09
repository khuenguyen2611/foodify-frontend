import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AgGridModule } from '@ag-grid-community/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DashboardModule } from './components/dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';
import { ProductsModule } from './components/products/products.module';
import { SalesModule } from './components/sales/sales.module';
import { MenusModule } from './components/menus/menus.module';
import { VendorsModule } from './components/vendors/vendors.module';
import { UsersModule } from './components/users/users.module';
import { AccountModule } from './components/account/account.module';
import { SettingModule } from './components/setting/setting.module';
import { AuthModule } from './components/auth/auth.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ModalModule } from "ngx-bootstrap/modal";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { AngularFireModule } from "@angular/fire/compat";
import { environment } from "../environments/environment";
import { FirebaseService } from "./shared/service/firebase.service";
import { AuthInterceptor } from "./shared/inceptor/auth-interceptor";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        AppRoutingModule,
        DashboardModule,
        AccountModule,
        SettingModule,
        AuthModule,
        SharedModule,
        ProductsModule,
        SalesModule,
        VendorsModule,
        MenusModule,
        UsersModule,
        AgGridModule,
        HttpClientModule,
        AngularFireStorageModule,
        AngularFireModule.initializeApp(environment.firebaseConfig, 'cloud'),
        ModalModule.forRoot()

    ],
    providers: [
        FirebaseService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
