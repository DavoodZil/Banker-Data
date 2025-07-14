# Angular Integration Guide

This document explains how to integrate the Banker Data iframe into your Angular application.

## Basic Integration

### 1. Add the iframe to your Angular component

```typescript
// app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-banker-data',
  template: `
    <iframe 
      #bankerDataIframe
      [src]="iframeUrl" 
      width="100%" 
      height="600px"
      style="border: none; border-radius: 8px;"
      (load)="onIframeLoad()">
    </iframe>
  `
})
export class BankerDataComponent implements OnInit, OnDestroy {
  iframeUrl = 'http://localhost:5173'; // Update with your iframe URL
  private messageHandler: (event: MessageEvent) => void;

  ngOnInit() {
    this.setupMessageListener();
  }

  ngOnDestroy() {
    if (this.messageHandler) {
      window.removeEventListener('message', this.messageHandler);
    }
  }

  private setupMessageListener() {
    this.messageHandler = (event: MessageEvent) => {
      if (event.data.source === 'banker-data-iframe') {
        this.handleIframeMessage(event.data);
      }
    };

    window.addEventListener('message', this.messageHandler);
  }

  private handleIframeMessage(message: any) {
    console.log('Received from iframe:', message);

    switch (message.action) {
      case 'iframe:ready':
        console.log('Iframe is ready:', message.data);
        break;
      
      case 'accounts:list':
        this.handleAccountsList(message.data);
        break;
      
      case 'transactions:list':
        this.handleTransactionsList(message.data);
        break;
      
      case 'categories:list':
        this.handleCategoriesList(message.data);
        break;
      
      // Add more action handlers as needed
      default:
        console.log('Unhandled action:', message.action);
    }
  }

  private handleAccountsList(data: any) {
    // Handle accounts list request
    // You can send data back to the iframe if needed
    this.sendToIframe('accounts:list:response', {
      accounts: [
        // Your actual account data
      ]
    });
  }

  private handleTransactionsList(data: any) {
    // Handle transactions list request
    this.sendToIframe('transactions:list:response', {
      transactions: [
        // Your actual transaction data
      ]
    });
  }

  private handleCategoriesList(data: any) {
    // Handle categories list request
    this.sendToIframe('categories:list:response', {
      categories: [
        // Your actual category data
      ]
    });
  }

  private sendToIframe(action: string, data: any) {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        source: 'angular-parent',
        action,
        data,
        timestamp: new Date().toISOString()
      }, '*');
    }
  }

  onIframeLoad() {
    console.log('Iframe loaded successfully');
  }
}
```

### 2. Add the component to your routing

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankerDataComponent } from './banker-data/banker-data.component';

const routes: Routes = [
  { path: 'banker-data', component: BankerDataComponent },
  // ... other routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

### 3. Create a service for iframe communication

```typescript
// iframe-communication.service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface IframeMessage {
  source: string;
  action: string;
  data: any;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class IframeCommunicationService {
  private messageSubject = new Subject<IframeMessage>();

  constructor() {
    this.setupMessageListener();
  }

  private setupMessageListener() {
    window.addEventListener('message', (event: MessageEvent) => {
      if (event.data.source === 'banker-data-iframe') {
        this.messageSubject.next(event.data);
      }
    });
  }

  getMessages(): Observable<IframeMessage> {
    return this.messageSubject.asObservable();
  }

  sendToIframe(action: string, data: any = {}) {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        source: 'angular-parent',
        action,
        data,
        timestamp: new Date().toISOString()
      }, '*');
    }
  }

  // Helper methods for common actions
  requestAccounts() {
    this.sendToIframe('accounts:request');
  }

  requestTransactions() {
    this.sendToIframe('transactions:request');
  }

  updateAccount(accountId: string, data: any) {
    this.sendToIframe('accounts:update', { accountId, data });
  }

  createTransaction(transaction: any) {
    this.sendToIframe('transactions:create', { transaction });
  }
}
```

### 4. Use the service in your components

```typescript
// some-other.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IframeCommunicationService } from './iframe-communication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-some-other',
  template: `
    <button (click)="requestAccounts()">Get Accounts</button>
    <button (click)="requestTransactions()">Get Transactions</button>
  `
})
export class SomeOtherComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(private iframeService: IframeCommunicationService) {}

  ngOnInit() {
    this.subscription = this.iframeService.getMessages().subscribe(
      (message) => {
        console.log('Received message:', message);
        // Handle messages here
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  requestAccounts() {
    this.iframeService.requestAccounts();
  }

  requestTransactions() {
    this.iframeService.requestTransactions();
  }
}
```

## Security Considerations

1. **Origin Validation**: Always validate the origin of messages from the iframe
2. **CSP Headers**: Configure Content Security Policy headers appropriately
3. **HTTPS**: Use HTTPS in production for secure communication

## Production Deployment

1. Build the iframe application:
   ```bash
   npm run build
   ```

2. Serve the built files from your web server

3. Update the iframe URL in your Angular application to point to the production URL

## Customization

You can customize the iframe behavior by:

1. Modifying the mock data in `src/api/mockData.js`
2. Updating the communication protocol in `src/utils/iframeCommunication.js`
3. Adding new actions and handlers as needed

## Troubleshooting

- Check browser console for communication errors
- Ensure the iframe URL is accessible
- Verify that postMessage is working correctly
- Check for CORS issues if serving from different domains 