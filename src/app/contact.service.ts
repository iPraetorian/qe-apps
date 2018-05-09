import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Contact } from '../contact';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ContactService {

  //URL to web api
  private contactsUrl = '/api/contacts';

  //constructor(private messageService: MessageService) { } OLD SERVICE INJECTION
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  //**GET contacts from server */
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.contactsUrl)
      .pipe(
        catchError(this.handleError('getContacts', []))
      );
  }

  //**GET contact by id. Return `undefined` when id not found */
  getContactNo404<Data>(id: number): Observable<Contact> {
    const url = `${this.contactsUrl}/?id=${id}`;
    return this.http.get<Contact[]>(url)
      .pipe(
        map(contacts => contacts[0]), //returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} contact id=${id}`);
        }),
        catchError(this.handleError<Contact>(`getContact id=${id}`))
      );
  }
  //**GET contact by id. Will 404 if id not found */
  getContact(id: number): Observable<Contact> {
    const url = `${this.contactsUrl}/${id}`;
    return this.http.get<Contact>(url).pipe(
      tap(_ => this.log(`fetched contact id=${id}`)),
      catchError(this.handleError<Contact>(`getContact id=${id}`))
    );
  }
  //**GET contacts whos name contains search term */
  searchContacts(term: string): Observable<Contact[]> {
    if (!term.trim()) {
      //if not search term, return empty contact array.
      return of([]);
    }
    return this.http.get<Contact[]>(`api/contacts/?name=${term}`).pipe(
      tap(_ => this.log(`found contacts matching "${term}"`)),
      catchError(this.handleError<Contact[]>('searchContacts', []))
    );

  }

  /////////Save Methods//////////////

  /**POST: add new contact to the server */
  addContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.contactsUrl, contact, httpOptions).pipe(
      tap((contact: Contact) => this.log(`added contact w/ id=${contact.id}`)),
      catchError(this.handleError<Contact>('addContact'))
    );
  }

  /** DELETE: delete contact from server */

  deleteContact(contact: Contact | number): Observable<Contact> {
    const id = typeof contact === 'number' ? contact : contact.id;
    const url = `${this.contactsUrl}/${id}`;

    return this.http.delete<Contact>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted contact id=${id}`)),
      catchError(this.handleError<Contact>('deleteContact'))
    );
  }

  /** PUT: update the contact on the server */

  updateContact(contact: Contact): Observable<any> {
    return this.http.put(this.contactsUrl, contact, httpOptions).pipe(
      tap(_ => this.log(`updated contact id=${contact.id}`)),
      catchError(this.handleError<any>('updateContact'))
    );
  }

  /*   Handle Http operation that failed.
   Let the app continue.
   @param operation - name of the operation that failed
   @param result - optional value to return as the observable result */

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


  //log a ContactService message with the MessageService 
  private log(message: string) {
    this.messageService.add('ContactService:' + message);
  }




}

