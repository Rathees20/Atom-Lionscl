# Lionsol Login App - TypeScript

A React Native Expo app built with TypeScript that replicates the Lionsol login screen design with proper component structure.

## Features

- **TypeScript Support**: Fully typed React Native application
- **Custom Routing**: URL-based navigation with browser history support
- **Responsive Design**: Works on both mobile and web platforms
- **Multiple Screens**: Login, Registration, OTP Verification, Dashboard, Add Complaint, and Routine Maintenance
- **Side Navigation**: Drawer menu with multiple options
- **Search Functionality**: Real-time search in maintenance items
- **Form Validation**: Input validation and error handling
- **Centralized Styling**: All styles organized in a single file
- **State Management**: React Context for navigation and user state
- **Mobile-First Design**: Optimized for mobile devices with web support

## Project Structure

```
├── App.tsx                      # Main application component with navigation
├── screens/                     # Screen components
│   ├── LoginPage.tsx           # Main login screen (OTP)
│   ├── RegisterPage.tsx        # Business registration screen
│   ├── OTPVerificationPage.tsx # OTP verification screen
│   ├── DashboardPage.tsx       # Main dashboard screen
│   ├── AddComplaintPage.tsx    # Add complaint screen
│   └── RoutineMaintenancePage.tsx # Routine maintenance screen
├── components/                  # Reusable UI components
│   ├── AppRouter.tsx           # Custom routing component
│   └── SideMenu.tsx            # Side navigation menu
├── contexts/                    # React contexts
│   └── NavigationContext.tsx   # Navigation state management
├── utils/                       # Utility functions
│   └── customRouter.ts         # Custom routing implementation
├── styles/                      # Centralized styles
│   └── index.ts                # All component styles
├── web/                         # Web-specific files
│   └── index.html              # HTML template
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── app.json                    # Expo configuration
└── README.md                   # Project documentation
```

## Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm start
```

3. **Run on your preferred platform:**
- Press `a` for Android
- Press `i` for iOS
- Press `w` for web

## TypeScript Features

### Navigation System
- **Custom Router**: URL-based routing with browser history
- **Context Management**: Global state for user and navigation
- **Route Protection**: Automatic redirects and route handling

### UI Components
- **Responsive Design**: Mobile-first with web support
- **Side Menu**: Drawer navigation with multiple options
- **Search Interface**: Real-time filtering and search functionality

### Form Handling
- **Input Validation**: Client-side validation for mobile numbers and OTP
- **Error Handling**: User-friendly error messages and feedback
- **State Management**: Form state with React hooks

## Dependencies

- **Expo SDK 50** - React Native framework
- **TypeScript 5.1.3** - Type checking and compilation
- **@types/react** - React type definitions
- **@types/react-native** - React Native type definitions
- **@expo/vector-icons** - Icon library

## Design Features

- **Orange and gray** color scheme matching Lionsol branding
- **Mobile-first** responsive design
- **Clean, modern UI** with proper spacing
- **Interactive elements** with proper touch feedback
- **Type-safe** component props and state management

## Development

The project uses TypeScript for:
- **Type safety** across all components and functions
- **Better IDE support** with autocomplete and error detection
- **Maintainable code** with clear interfaces and types
- **API integration** with typed request/response handling

## Development Features

The app includes:
- **Custom Routing**: Browser URL updates with navigation
- **State Management**: React Context for global state
- **Responsive Design**: Works on mobile and web
- **Search Functionality**: Real-time filtering and search
- **Form Validation**: Input validation and error handling