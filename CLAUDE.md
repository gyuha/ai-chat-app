# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication Style

**All messages, commits, and documentation should be written in Korean.** This includes:
- Chat messages to the user
- Git commit messages
- Documentation and comments
- Code explanations

## Project Overview

A web-based chat application using OpenRouter's free API. The project consists of a backend server (to hide API keys) and a frontend web application.

## Technology Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Purpose**: Proxy API requests to OpenRouter, keeping API keys secure on the server

### Frontend
- **Framework**: React with TypeScript
- **UI Components**: shadcn/ui
- **State Management**: zustand
- **Data Fetching**: @tanstack-query
- **Routing**: @tanstack-router
- **Package Manager**: pnpm
- **Linter/Formatter**: biome

## Commands

Once the project is set up:

```bash
# Install dependencies (use pnpm)
pnpm install

# Backend commands (from backend/ directory)
pnpm run start:dev     # Development server
pnpm run build         # Build for production
pnpm run test          # Run tests

# Frontend commands (from frontend/ directory)
pnpm run dev           # Development server
pnpm run build         # Build for production
pnpm run lint          # Run biome linter
pnpm run format        # Run biome formatter
```

## Architecture Notes

- The backend server acts as a proxy to OpenRouter's API, handling API key management server-side
- Frontend communicates with the backend instead of directly calling OpenRouter
- Chat state is managed via zustand stores
- Server state (API responses) is managed via @tanstack-query

## Design System

**Always read DESIGN.md before making any visual or UI decisions.**

All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.
In QA mode, flag any code that doesn't match DESIGN.md.

**Key Design Principles:**
- **Minimal aesthetic:** Typography and whitespace only. No decoration.
- **Restrained colors:** Grayscale palette (#1a1a1a, #6b6b6b, #f9f9f9, #ffffff). No purple gradients.
- **Small border-radius:** 4-8px (not shadcn defaults). Functional and sharp.
- **Contrast sidebar:** Darker gray background for layout hierarchy.
- **Empty states are features:** Warm, with illustration/icon + guidance + CTA.
- **Recoverable errors:** Error message + "Retry" button + support link.
