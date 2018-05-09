import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsComponent } from '../contacts/contacts.component';
import { HomeComponent } from '../home/home.component';
import { ContactDetailComponent } from '../contact-detail/contact-detail.component';

const routes: Routes = [

  { path: 'contacts', component: ContactsComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'detail/:id', component: ContactDetailComponent }
];


@NgModule({

  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

