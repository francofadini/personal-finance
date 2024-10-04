# Project Memory

## Tech Stack
- JavaScript
- Next.js
- Ant Design 5
- Vercel
- MongoDB (Atlas)
- NextAuth
- GoCardless API

## Architecture and Best Practices

### Code Structure
- Pages in `src/pages`
- API routes in `src/pages/api`
- Components in `src/components`
- Backend logic in `src/backend`
- Services in `src/services`
- Use cases in `src/backend/use-cases`
- Models in `src/backend/models`

### Frontend
- Mobile-first approach
- Component-based architecture
- Styled-components for CSS
- React Context for state management
- Ant Design components for UI

### Backend
- API routes as controllers
- Use cases for business logic
- MongoDB for data persistence
- NextAuth for authentication

### API Structure
- Separate file for each endpoint
- Follow RESTful principles

## Key Components
- BottomNavigation: Mobile navigation
- AccountList: Display user's bank accounts
- CategoryList: Manage expense/income categories
- AddButton: Reusable button for adding items
- LoadingSpinner: Centralized loading indicator

## Available Use Cases
- createAccount
- getAccounts
- updateAccount
- deleteAccount

## GoCardless Integration
- API Service: `src/backend/services/gocardlessService.js`
- Key functions: getAccessToken, listGocardlessAccounts, getRequisitions, createRequisition, finalizeRequisition

## API Endpoints
- GET /api/gocardless/accounts
- GET /api/gocardless/requisitions
- GET /api/gocardless/institutions
- POST /api/gocardless/requisitions
- POST /api/gocardless/requisitions-finalize

## Environment Variables
- GOCARDLESS_SECRET_ID
- GOCARDLESS_SECRET_KEY
- NEXT_PUBLIC_BASE_URL

## Callback Handling
- Callback URL includes 'ref' parameter
- Use 'ref' to fetch requisition details and finalize

## Future Considerations
- Implement error handling and logging for API interactions
- Add rate limiting for API calls
- Implement webhook handling for GoCardless events
- Consider moving GoCardless API calls to a separate microservice
- Implement caching for performance improvement
- Add support for more countries
- Implement proper database operations for account linking
- Add unit and integration tests

## Important Links
- GoCardless API Documentation: https://bankaccountdata.gocardless.com/api/v2/swagger.json
- GoCardless Developer Portal: https://developer.gocardless.com/
