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

## Authentication Flow

This application implements a token-based authentication system similar to the virtual-card-maker-app-master project.

### Authentication Features

- **Token-based authentication** using sessionStorage
- **Protected routes** that require valid tokens
- **URL parameter handling** for token and baseUrl
- **Automatic token inclusion** in API requests
- **Unauthorized page** for invalid access attempts
- **Logout functionality** to clear authentication

### How Authentication Works

1. **Token Storage**: Authentication tokens are stored in sessionStorage as `app_token`
2. **Base URL Storage**: API base URLs can be stored as `base_url` in sessionStorage
3. **URL Parameters**: Tokens and base URLs can be passed via URL parameters
4. **Route Protection**: All routes except `/unauthorized` require authentication
5. **API Integration**: Tokens are automatically included in API requests

### URL Parameters

The application accepts the following URL parameters:

- `token`: Authentication token (required for access)
- `baseUrl`: API base URL (optional)

Example URLs:
```
http://localhost:5173/?token=your_token_here
http://localhost:5173/dashboard?token=your_token&baseUrl=https://api.example.com
```

### Testing Authentication

Visit `/auth-test` to see the current authentication status and test the flow.

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