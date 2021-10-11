import { NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { SharedModule } from './shared/shared.module';
import { BreedLayoutComponent } from './main-layout/breed-layout/breed-layout.component';
import { BreedListComponent } from './main-layout/breed-layout/breed-list/breed-list.component';
import { BreedDescriptionComponent } from './main-layout/breed-layout/breed-description/breed-description.component';
import { SearchBreedsPipe } from './pipes/search-breeds.pipe';
import { ShowImageDialogComponent } from './main-layout/breed-layout/breed-description/show-image-dialog/show-image-dialog.component';
import { LoginComponent } from './main-layout/login/login.component';
import { AuthInterceptor } from './auth.interceptor';
import { EditUserCommentDialogComponent } from './main-layout/breed-layout/breed-description/edit-user-comment-dialog/edit-user-comment-dialog.component';

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: AuthInterceptor,
};

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    BreedLayoutComponent,
    BreedListComponent,
    BreedDescriptionComponent,
    SearchBreedsPipe,
    ShowImageDialogComponent,
    LoginComponent,
    EditUserCommentDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
  ],
  providers: [INTERCEPTOR_PROVIDER],
  bootstrap: [AppComponent],
})
export class AppModule {}
