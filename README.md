# Banker Data App

This is a React-based financial data management application designed to be embedded as an iframe within an Angular application.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

- Account management
- Transaction tracking
- Category management
- Rule-based categorization
- Financial entity management
- Mock data for demonstration

## Iframe Integration

This application is designed to be embedded as an iframe within an Angular application. It communicates with the parent application using the `postMessage` API.

### Communication Protocol

The iframe sends messages to the parent Angular application with the following structure:

```javascript
{
  source: 'banker-data-iframe',
  action: 'action:type',
  data: { /* action-specific data */ }
}
```

### Supported Actions

- `accounts:list`, `accounts:get`, `accounts:create`, `accounts:update`, `accounts:delete`
- `transactions:list`, `transactions:get`, `transactions:create`, `transactions:update`, `transactions:delete`
- `categories:list`, `categories:create`, `categories:update`, `categories:delete`
- `rules:list`, `rules:create`, `rules:update`, `rules:delete`
- `tags:list`, `tags:create`, `tags:update`, `tags:delete`
- `entities:list`, `entities:create`, `entities:update`, `entities:delete`
- `plaid:*` - Plaid integration actions
- `auth:*` - Authentication actions
- `llm:invoke` - LLM integration
- `email:send` - Email integration
- `file:upload`, `file:extract` - File operations

### Listening for Parent Messages

The iframe can also receive messages from the parent Angular application:

```javascript
window.addEventListener('message', (event) => {
  if (event.data.source === 'angular-parent') {
    // Handle message from parent
    console.log(event.data);
  }
});
```

## Mock Data

The application currently uses mock data for demonstration purposes. In a production environment, you would replace the mock implementations in `src/api/` with actual API calls to your backend services.