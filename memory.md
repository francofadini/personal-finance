# Project Memory

## Component-Based Architecture

- We are adopting a component-based architecture to improve code organization and reusability.
- Common UI elements and logical units should be extracted into separate components.
- Components should be placed in a `components` directory, organized by feature or global use.

## Layout and Navigation

- The application follows a mobile-first strategy.
- The main layout consists of two primary screens: Accounts and Categories.
- Navigation is done through a bottom TabBar for easy mobile access.
- The layout is simplified to focus on core functionality for mobile users.

## Components to Build

1. BottomNavigation
   - Custom-built component using styled-components
   - Uses `antd` icons for consistency
   - Handles navigation between main screens (Accounts and Categories)
   - Includes a sign-out option

2. AccountList
   - Displays a list of user's linked bank accounts
   - Allows deleting accounts

3. CategoryList
   - Shows a list of expense and income categories
   - Can be used in the Categories screen

4. AddButton
   - A reusable button for adding new items (accounts, categories, transactions)

5. LoadingSpinner
   - A centralized loading indicator component

## Screens

1. Accounts (Home page)
   - Uses AccountList component
   - Allows adding new accounts and viewing transaction history

2. Categories
   - Uses CategoryList component
   - Enables users to add, edit, or delete categories

## Authentication

- Login, Register, and Forgot Password pages are considered public routes
- The main application screens (Accounts and Categories) require authentication

## Mobile-First Approach

- UI components are designed to be touch-friendly
- Layouts are optimized for smaller screens, with considerations for larger displays
- Use of bottom navigation for better reachability on mobile devices

## GoCardless Integration

- GoCardless API Documentation: https://bankaccountdata.gocardless.com/api/v2/swagger.json
- Implemented backend service for GoCardless API interactions
- Created API endpoints for GoCardless integration:
  - GET /api/gocardless/accounts?requisitionId=<requisition_id>
  - GET /api/gocardless/requisitions?limit=<limit>&offset=<offset>

## Environment Variables

- GOCARDLESS_SECRET_ID: Secret ID for GoCardless API
- GOCARDLESS_SECRET_KEY: Secret Key for GoCardless API
- NEXT_PUBLIC_BASE_URL: The base URL of your application, used for constructing the redirect URL

## Backend Services

- gocardlessService.js: Handles GoCardless API interactions
  - getAccessToken(): Fetches and caches the access token
  - listGocardlessAccounts(requisitionId): Fetches accounts for a given requisition
  - getRequisitions(limit, offset): Fetches the list of requisitions with pagination
  - finalizeRequisition(requisitionId): Fetches requisition details using the reference ID, then finalizes it

## API Endpoints

- GET /api/gocardless/accounts: Fetches GoCardless accounts for a given requisition ID
- GET /api/gocardless/requisitions: Fetches the list of requisitions with optional pagination
- GET /api/gocardless/institutions: Fetches the list of financial institutions for a given country code
- POST /api/gocardless/create-requisition: Creates a new requisition for linking a bank account
- POST /api/gocardless/requisitions: Creates a new requisition for linking a bank account
- POST /api/gocardless/requisitions/finalize: Finalizes a requisition using the reference ID provided in the callback

## Future Considerations

- Implement error handling and logging for GoCardless API interactions
- Add rate limiting to prevent abuse of the GoCardless API
- Implement webhook handling for GoCardless events
- Consider moving GoCardless API calls to a separate microservice for better scalability
- Implement caching for requisitions to improve performance and reduce API calls
- Regularly check the GoCardless API documentation for updates and new features
- Implement error handling and user feedback in the AddAccountButton component
- Consider caching the list of institutions to reduce API calls
- Add support for more countries as needed
- Implement the next steps in the account addition process (creating a requisition, handling the bank's authentication flow, etc.)
- Implement proper error handling and logging for the requisition creation process
- Expand the CallbackPage to handle different scenarios (success, failure, cancellation)
- Implement a proper account linking finalization process in the backend
- Consider adding a loading state or progress indicator during the requisition creation process
- Implement proper state management to handle the account linking flow across components and pages

## Important Links

- GoCardless API Documentation: https://bankaccountdata.gocardless.com/api/v2/swagger.json
- GoCardless Developer Portal: https://developer.gocardless.com/

## Dependencies

- We are using `antd-mobile` for mobile-optimized UI components, particularly for the bottom navigation.
- Ensure that `antd-mobile` is installed in the project dependencies.

## Components

AddAccountButton
- Uses the '/api/gocardless/requisitions' endpoint to create a new requisition
- Redirects the user to the bank's authentication page using the link returned from the API

## UI/UX Considerations

- Use of emojis for country flags to improve visual recognition
- Integration of institution logos to enhance brand recognition
- Implementation of search/filter functionality for better user experience with long lists of institutions
- Proper alignment of institution logos with text for improved readability and aesthetics
- Consistent display of institution logos and names in both dropdown options and selected values

## Future Considerations

- Implement caching for the list of institutions to reduce API calls
- Add support for more countries as needed
- Consider implementing a more sophisticated search algorithm for institutions (e.g., fuzzy search)
- Explore possibilities for preloading or lazy-loading institution logos to optimize performance
- Implement the next steps in the account addition process (creating a requisition, handling the bank's authentication flow, etc.)

Remember to keep updating this file as the project evolves and new features are added.

## Pages

CallbackPage
- Handles the redirect from the bank after authentication
- Uses the 'ref' query parameter to finalize the requisition
- Calls the '/api/gocardless/requisitions-finalize' endpoint to complete the process
- Displays appropriate success or error messages to the user
- Provides a button to return to the dashboard

## Future Considerations

- Implement proper error handling for different scenarios in the requisitions-finalize endpoint
- Add detailed logging in the requisitions-finalize endpoint for easier debugging
- Consider implementing a retry mechanism for failed finalizations
- Implement proper database operations to save the linked account information after successful finalization
- Add unit and integration tests for the requisition finalization process

## API Endpoints

- POST /api/gocardless/requisitions-finalize: Finalizes a requisition using the reference ID provided in the callback

## Future Considerations

- Ensure consistent error handling across all components and API calls
- Implement proper logging for API calls and responses for easier debugging
- Consider implementing a more robust state management solution (e.g., Redux) for handling the account linking flow
- Add unit and integration tests for the account linking process

## Callback Handling

- The callback URL from GoCardless includes a 'ref' parameter instead of a 'requisition_id'
- The 'ref' parameter is used to fetch the corresponding requisition details before finalization
