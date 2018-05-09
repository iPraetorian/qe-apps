import { TestBed, inject } from '@angular/core/testing';

import { ContactService } from './contact.service';
import { MessageService } from './message.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


describe('ContactService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ContactService, MessageService]
    });
  });

  it('should be created', inject([ContactService], (service: ContactService) => {
    expect(service).toBeTruthy();
  }));
});
