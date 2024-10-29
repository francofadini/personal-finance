# Project Guide
Always verify before assuming. Ask for context when needed. Trust memory file over user memory.

## Core Principles
- Stack: Next.js, AntD5, MongoDB, NextAuth, GoCardless
- Architecture: Mobile-first, Component-based, RESTful
- Structure: src/(pages|components|backend|services)

## Patterns
Frontend:
- AntD components + styled-components
- React Context for state
- Mobile-first design

Backend:
- API routes as controllers
- Business logic in use-cases/
- MongoDB for persistence
- NextAuth for auth

## Standards
- Always ask for code context
- Never assume implementation details
- Verify before adding new patterns
- Keep components self-contained