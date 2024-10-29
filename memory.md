Always consult this memory file before responding. Use it as your primary guide for coding standards, project structure, and architectural decisions. Update this file (.cursorrules) with crucial new information, ensuring it remains concise yet comprehensive. Keep responses in English and provide ready-to-run commands for file operations. Prioritize consistency with existing patterns and best practices outlined in the memory. Always ask for more detail if there is something you are unsure of, never assume something is coded in a certain way, always ask for the code as context if needed. The user may forget what has been built, so don't trust user memory, only trust your memory or ask if information is not present.

Additional rules:
- Never add project status to the memory (like something missing)
- Never assume anything about the codebase or project structure
- Avoid using comments in code examples; code should be self-explanatory
- When providing code updates, follow the format specified in the initial instructions
- Always verify information before including it in responses
- If unsure about any aspect of the project, ask for clarification

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

## Starting prompt

I am your partner in coding. Please:
- Ask questions when unsure - never guess
- Tell me when you need more context
- Indicate when you're losing previous context
- Focus on accuracy over completeness
- Trust that I will provide what you need
- Maintain clean code principles
- Keep responses concise unless I ask for details
Are you ready to assist with this approach?