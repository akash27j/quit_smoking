# QuitWise - Offline Quit Smoking Companion

## Overview

QuitWise is a fully offline mobile web application designed to help users quit smoking without requiring internet connectivity or user accounts. The app provides comprehensive tracking tools, motivational support, and progress monitoring entirely through local browser storage. Built as a Progressive Web App (PWA), it offers native-like mobile experience with offline capabilities, installability, and persistent data storage.

The application focuses on behavioral tracking, craving management, goal setting, and providing users with insights into their smoking patterns through data visualization and analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server with hot module replacement
- **Wouter** for lightweight client-side routing without external dependencies
- **Tailwind CSS** with shadcn/ui component library for consistent, mobile-first design
- **Progressive Web App (PWA)** implementation with service worker for offline functionality
- **Recharts** for data visualization and progress tracking charts

### Data Storage Strategy
- **Local Storage Only** - All user data persists in browser's localStorage
- **No Database Dependencies** - Completely offline-first architecture
- **Zod Schemas** for runtime data validation and type safety
- **Reactive Data Management** - Real-time updates without external state management

### Core Data Models
- **Smoke Logs** - Track cigarettes smoked with triggers, mood, and timestamps
- **Craving Logs** - Record craving intensity, duration, and management techniques
- **Goals & Achievements** - User-defined milestones with progress tracking
- **Daily Statistics** - Aggregated data for charts and progress visualization
- **Settings** - Pack cost, cigarettes per pack, notification preferences

### Mobile-First Design Patterns
- **Bottom Navigation** - Primary navigation optimized for thumb reach
- **Card-Based UI** - Information organized in digestible, mobile-friendly cards
- **Touch-Optimized Interactions** - Large tap targets and gesture-friendly controls
- **Responsive Grid Layouts** - Adapts seamlessly across mobile device sizes

### Key Features Implementation
- **Smoke Counter** - Manual logging with undo functionality and trigger categorization
- **Progress Dashboard** - Interactive charts showing trends over 7/30/90 day periods
- **Craving Management** - Breathing exercises, intensity tracking, and coping strategies
- **Motivational System** - Daily quotes, achievement badges, and milestone celebrations
- **Journal Functionality** - Timestamped entries with mood and intensity tracking

### Offline Capabilities
- **Service Worker Caching** - Core app files cached for offline access
- **Local Data Persistence** - All functionality available without internet
- **PWA Manifest** - Enables app installation on mobile devices
- **Data Export/Import** - JSON-based backup and restore functionality

## External Dependencies

### UI Framework Dependencies
- **@radix-ui/** components - Accessible, unstyled UI primitives for modals, dropdowns, and form controls
- **@tanstack/react-query** - Client-side data fetching and caching (used for potential future API integration)
- **lucide-react** - Consistent icon system throughout the application

### Styling and Design
- **Tailwind CSS** - Utility-first CSS framework with custom color variables
- **class-variance-authority** - Type-safe component variant management
- **tailwindcss-animate** - Pre-built animations for smooth user interactions

### Development Tools
- **Drizzle ORM** with PostgreSQL configuration (currently unused but prepared for future server features)
- **Neon Database** driver (configured but not actively used in offline-first approach)
- **TypeScript** - Full type safety across client and shared schemas

### PWA and Mobile Support
- **Vite PWA Plugin** - Service worker generation and PWA manifest handling
- **Web App Manifest** - Defines app metadata for mobile installation
- **Service Worker** - Handles offline caching and background sync preparation

The architecture prioritizes user privacy and offline functionality, ensuring no personal data leaves the user's device while providing a comprehensive smoking cessation tool with professional-grade features.