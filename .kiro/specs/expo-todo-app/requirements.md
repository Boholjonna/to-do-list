# Requirements Document

## Introduction

The Expo To-Do List app is a simple single-user mobile task management application for Android that enables users to create, organize, and track personal tasks with categories, priorities, due dates, and reminders. The system uses AsyncStorage for local persistence, Expo SDK 54 for cross-platform development, and runs within Expo Go without custom native builds. The app provides a customizable theming system with gradient and solid color backgrounds, supports light and dark modes, and delivers local push notifications for task reminders. This is a learning project focused on fundamental to-do list functionality with local-only storage.

## Glossary

- **Task_Manager**: The core system component responsible for task lifecycle operations (create, read, update, delete, complete)
- **Theme_Engine**: The UI theming subsystem managing color schemes, gradients, and appearance modes
- **Category_Manager**: The subsystem managing user-defined task categories with colors
- **Notification_Scheduler**: The local notification subsystem scheduling and delivering task reminders
- **Search_Engine**: The subsystem providing real-time task search functionality
- **Storage_Layer**: The persistence layer interfacing with AsyncStorage for local data storage
- **Task**: A to-do item with title, notes, category, priority, due date, and completion status
- **Category**: A user-defined label with associated color for grouping tasks
- **Priority**: An enumerated value (low, medium, high) indicating task urgency
- **Theme_Mode**: An enumerated value (light, dark, system) controlling color scheme
- **Background_Type**: An enumerated value (solid, gradient) controlling background rendering
- **Gradient**: A multi-stop color transition with 2-4 color stops
- **Completed_Task**: A task with a non-null completed_at timestamp
- **Overdue_Task**: An incomplete task with due_date before current time
- **Reminder_Option**: An enumerated value (at_time, 10_min_before, 1_hour_before, 1_day_before) controlling notification timing

## Requirements

### Requirement 1: Task Creation

**User Story:** As a user, I want to create tasks with title, notes, category, priority, and due date, so that I can capture all relevant information about my to-dos.

#### Acceptance Criteria

1. THE Task_Manager SHALL provide a task creation form accessible via a floating action button
2. THE Task_Manager SHALL require a task title with length between 1 and 120 characters
3. WHEN a user submits a task with valid title, THE Task_Manager SHALL create the task and persist to AsyncStorage within 500ms
4. THE Task_Manager SHALL accept optional notes text with maximum length of 5000 characters
5. THE Task_Manager SHALL accept optional category selection from user-defined categories
6. THE Task_Manager SHALL accept optional priority selection from values (low, medium, high)
7. THE Task_Manager SHALL accept optional due date and time via date-time picker
8. THE Task_Manager SHALL accept optional reminder selection from values (at_time, 10_min_before, 1_hour_before, 1_day_before)
9. WHEN a user submits a task without required title, THE Task_Manager SHALL display a validation error and prevent submission
10. WHEN a user submits a task creation form, THE Task_Manager SHALL display a loading indicator until completion or error
11. WHEN task creation fails, THE Task_Manager SHALL display a descriptive error message and retain form input
12. WHEN a task is created with a reminder option, THE Notification_Scheduler SHALL schedule a local notification at the calculated time
13. THE Task_Manager SHALL assign a unique ID to each task using UUID or timestamp-based identifier

### Requirement 2: Task Display

**User Story:** As a user, I want to view all my tasks in a scrollable list with visual indicators for status and metadata, so that I can quickly scan my to-dos.

#### Acceptance Criteria

1. THE Task_Manager SHALL display tasks in a scrollable vertical list ordered by creation date descending
2. THE Task_Manager SHALL display each task showing title, category chip, priority icon, due date, and completion checkbox
3. THE Task_Manager SHALL display a loading skeleton with 5 placeholder cards while loading tasks from AsyncStorage
4. WHEN no tasks exist, THE Task_Manager SHALL display an empty state message with illustration
5. THE Task_Manager SHALL support pull-to-refresh gesture to reload tasks from AsyncStorage
6. WHEN a user pulls to refresh, THE Task_Manager SHALL display a loading indicator and reload data within 500ms
7. THE Task_Manager SHALL display overdue tasks with red date text
8. THE Task_Manager SHALL display completed tasks with strike-through title and reduced opacity
9. WHEN task data loading fails, THE Task_Manager SHALL display an error message with retry button
10. THE Task_Manager SHALL render task cards with semi-transparent backgrounds readable over any theme background
11. WHEN the app launches, THE Task_Manager SHALL load and display tasks within 500ms

### Requirement 3: Task Completion Toggle

**User Story:** As a user, I want to mark tasks as complete or incomplete by tapping a checkbox, so that I can track my progress.

#### Acceptance Criteria

1. THE Task_Manager SHALL display a checkbox control at the left edge of each task card
2. WHEN a user taps the checkbox on an incomplete task, THE Task_Manager SHALL immediately update the UI to show completed state
3. WHEN a user taps the checkbox on a completed task, THE Task_Manager SHALL immediately update the UI to show incomplete state
4. WHEN marking a task complete, THE Task_Manager SHALL set the completed_at timestamp to current UTC time
5. WHEN marking a task incomplete, THE Task_Manager SHALL set the completed_at field to null
6. THE Task_Manager SHALL persist completion state changes to AsyncStorage within 500ms
7. THE Task_Manager SHALL update the UI immediately before persisting to storage
8. WHEN storage update fails, THE Task_Manager SHALL rollback the UI to previous state and display error notification
9. WHEN a task is marked complete, THE Notification_Scheduler SHALL cancel any scheduled reminders for that task
10. THE Task_Manager SHALL animate the checkbox state transition with 200ms duration

### Requirement 4: Task Editing

**User Story:** As a user, I want to edit any field of an existing task, so that I can update information as my plans change.

#### Acceptance Criteria

1. WHEN a user taps on a task card, THE Task_Manager SHALL open the task editing form with current values pre-filled
2. THE Task_Manager SHALL allow editing of title, notes, category, priority, due date, and reminder option
3. THE Task_Manager SHALL validate edited title length between 1 and 120 characters
4. THE Task_Manager SHALL validate edited notes maximum length of 5000 characters
5. WHEN a user saves valid edits, THE Task_Manager SHALL update the task and persist to AsyncStorage within 500ms
6. WHEN a user saves invalid edits, THE Task_Manager SHALL display validation errors and prevent submission
7. THE Task_Manager SHALL provide a cancel button that discards changes and closes the form
8. WHEN task update fails, THE Task_Manager SHALL display a descriptive error message and retain form input
9. WHEN a user changes the reminder option, THE Notification_Scheduler SHALL reschedule the notification accordingly
10. THE Task_Manager SHALL update the updated_at timestamp on every edit

### Requirement 5: Task Deletion

**User Story:** As a user, I want to delete tasks with confirmation and undo option, so that I can remove tasks safely without accidental loss.

#### Acceptance Criteria

1. THE Task_Manager SHALL provide a delete action accessible via swipe gesture or delete button
2. WHEN a user initiates deletion, THE Task_Manager SHALL display a confirmation dialog with Cancel and Delete buttons
3. WHEN a user confirms deletion, THE Task_Manager SHALL immediately remove the task from the UI
4. WHEN a user confirms deletion, THE Task_Manager SHALL display a snackbar with Undo button for 5 seconds
5. WHEN a user taps Undo within 5 seconds, THE Task_Manager SHALL restore the task to the list and cancel the deletion
6. WHEN the undo timeout expires, THE Task_Manager SHALL permanently delete the task from AsyncStorage
7. THE Task_Manager SHALL update the UI immediately before persisting to storage
8. WHEN storage deletion fails, THE Task_Manager SHALL restore the task to the list and display error notification
9. WHEN a task is deleted, THE Notification_Scheduler SHALL cancel any scheduled reminders for that task
10. THE Task_Manager SHALL animate task removal with slide-out transition of 300ms duration

### Requirement 6: Category Management

**User Story:** As a user, I want to create, rename, recolor, and delete categories, so that I can organize my tasks into meaningful groups.

#### Acceptance Criteria

1. THE Category_Manager SHALL provide a category management screen accessible from settings
2. THE Category_Manager SHALL allow creating categories with name and color selection
3. THE Category_Manager SHALL validate category name length between 1 and 40 characters
4. THE Category_Manager SHALL require unique category names
5. WHEN a user creates a category, THE Category_Manager SHALL persist it to AsyncStorage within 500ms
6. THE Category_Manager SHALL allow editing category name and color via tap gesture
7. THE Category_Manager SHALL allow deleting categories via swipe gesture or delete button
8. WHEN a user deletes a category, THE Category_Manager SHALL set category_id to null for all associated tasks
9. THE Category_Manager SHALL display categories in a list showing name and colored circle indicator
10. THE Category_Manager SHALL assign a unique ID to each category using UUID or timestamp-based identifier
11. WHEN category creation or update fails, THE Category_Manager SHALL display a descriptive error message

### Requirement 7: Priority Levels

**User Story:** As a user, I want to assign priority levels (low, medium, high) to tasks with visual indicators, so that I can identify urgent items quickly.

#### Acceptance Criteria

1. THE Task_Manager SHALL support three priority levels: low, medium, high
2. THE Task_Manager SHALL display priority as a colored icon on each task card
3. THE Task_Manager SHALL use green color and down-arrow icon for low priority
4. THE Task_Manager SHALL use yellow color and minus icon for medium priority
5. THE Task_Manager SHALL use red color and up-arrow icon for high priority
6. THE Task_Manager SHALL provide priority filter options in the filter sheet
7. WHEN a user applies priority filter, THE Task_Manager SHALL display only tasks matching selected priorities
8. THE Task_Manager SHALL provide priority sorting option (high to low, low to high)
9. WHEN a user applies priority sort, THE Task_Manager SHALL reorder tasks accordingly within 500ms
10. THE Task_Manager SHALL persist priority value in the tasks table priority column

### Requirement 8: Due Dates and Grouping

**User Story:** As a user, I want to set due dates with time and see tasks grouped by Today, Upcoming, and No Date, so that I can focus on time-sensitive items.

#### Acceptance Criteria

1. THE Task_Manager SHALL provide date picker and time picker controls in task forms
2. THE Task_Manager SHALL store due dates with time precision in UTC format
3. THE Task_Manager SHALL provide grouping options: Today, Upcoming, No Date, All
4. WHEN a user selects Today grouping, THE Task_Manager SHALL display only tasks with due_date on current calendar day
5. WHEN a user selects Upcoming grouping, THE Task_Manager SHALL display only tasks with due_date after current day
6. WHEN a user selects No Date grouping, THE Task_Manager SHALL display only tasks with null due_date
7. THE Task_Manager SHALL highlight overdue tasks with red text and warning icon
8. THE Task_Manager SHALL consider a task overdue when due_date is before current time and completed_at is null
9. THE Task_Manager SHALL display due date in user-friendly format (e.g., "Today 2:30 PM", "Tomorrow 9:00 AM", "Jan 15, 3:00 PM")
10. THE Task_Manager SHALL sort tasks within groups by due date ascending

### Requirement 9: Search Functionality

**User Story:** As a user, I want to search tasks by title and notes with live results, so that I can quickly find specific tasks.

#### Acceptance Criteria

1. THE Search_Engine SHALL provide a search input field accessible from the main task list screen
2. WHEN a user types in the search field, THE Search_Engine SHALL filter tasks matching the query in title or notes
3. THE Search_Engine SHALL debounce search input with 300ms delay before filtering
4. THE Search_Engine SHALL perform case-insensitive search matching
5. THE Search_Engine SHALL highlight matching text in search results
6. WHEN search query is empty, THE Search_Engine SHALL display all tasks
7. WHEN search query returns no results, THE Search_Engine SHALL display "No tasks found" message
8. THE Search_Engine SHALL search in-memory task data without requiring storage access
9. THE Search_Engine SHALL display search results within 100ms of debounce completion
10. THE Search_Engine SHALL provide a clear button to reset search and show all tasks

### Requirement 10: Local Notifications

**User Story:** As a user, I want to receive local reminder notifications at scheduled times, so that I don't forget important tasks.

#### Acceptance Criteria

1. THE Notification_Scheduler SHALL support four reminder options: at_time, 10_min_before, 1_hour_before, 1_day_before
2. WHEN a user selects at_time reminder, THE Notification_Scheduler SHALL schedule notification at the task due_date time
3. WHEN a user selects 10_min_before reminder, THE Notification_Scheduler SHALL schedule notification 10 minutes before due_date
4. WHEN a user selects 1_hour_before reminder, THE Notification_Scheduler SHALL schedule notification 1 hour before due_date
5. WHEN a user selects 1_day_before reminder, THE Notification_Scheduler SHALL schedule notification 24 hours before due_date
6. THE Notification_Scheduler SHALL store the scheduled notification ID in the tasks table notification_id column
7. WHEN a notification triggers, THE Notification_Scheduler SHALL display task title and notes in the notification content
8. WHEN a user taps a notification, THE Notification_Scheduler SHALL open the app and navigate to the task detail view
9. THE Notification_Scheduler SHALL request notification permissions on first app launch
10. WHEN notification permissions are denied, THE Notification_Scheduler SHALL display a message explaining reminders require permissions
11. THE Notification_Scheduler SHALL cancel scheduled notifications when tasks are completed or deleted
12. THE Notification_Scheduler SHALL reschedule notifications when task due_date or reminder_option changes

### Requirement 11: Theme System - Mode and Background Type

**User Story:** As a user, I want to switch between light, dark, and system themes with solid or gradient backgrounds, so that I can customize the app appearance to my preference.

#### Acceptance Criteria

1. THE Theme_Engine SHALL support three theme modes: light, dark, system
2. WHEN a user selects system mode, THE Theme_Engine SHALL automatically switch between light and dark based on device settings
3. THE Theme_Engine SHALL support two background types: solid and gradient
4. WHEN a user selects solid background, THE Theme_Engine SHALL render a single color background
5. WHEN a user selects gradient background, THE Theme_Engine SHALL render a multi-stop gradient background
6. THE Theme_Engine SHALL provide a settings screen with theme mode and background type controls
7. WHEN a user changes theme settings, THE Theme_Engine SHALL apply changes immediately without app restart
8. THE Theme_Engine SHALL persist theme settings in AsyncStorage for instant load on app launch
9. THE Theme_Engine SHALL load theme settings from AsyncStorage within 100ms on app launch
10. THE Theme_Engine SHALL provide default dark gradient (#0B1B3F, #5B21B6, #0D9488, #000000) and light gradient (#DBEAFE, #DDD6FE, #99F6E4, #F8FAFC)

### Requirement 12: Theme System - Custom Colors

**User Story:** As a user, I want to choose from preset colors or create custom colors for backgrounds, so that I can personalize my app appearance.

#### Acceptance Criteria

1. THE Theme_Engine SHALL provide color preset buttons for quick selection
2. THE Theme_Engine SHALL provide a custom color picker using reanimated-color-picker
3. WHEN background type is solid, THE Theme_Engine SHALL allow selecting or customizing a single color
4. WHEN background type is gradient, THE Theme_Engine SHALL allow selecting or customizing 2 to 4 color stops
5. THE Theme_Engine SHALL provide add and remove buttons for gradient color stops
6. THE Theme_Engine SHALL validate gradient has minimum 2 color stops and maximum 4 color stops
7. WHEN a user selects a preset color, THE Theme_Engine SHALL apply it immediately with animated transition
8. WHEN a user customizes a color via picker, THE Theme_Engine SHALL update the preview in real-time
9. THE Theme_Engine SHALL persist custom colors in AsyncStorage
10. THE Theme_Engine SHALL render gradients with top-left to bottom-right diagonal direction

### Requirement 13: Theme System - Readability and Accessibility

**User Story:** As a user, I want text and UI elements to remain readable over any background, so that I can use the app comfortably with any theme.

#### Acceptance Criteria

1. THE Theme_Engine SHALL render task cards, input fields, and bottom sheets with semi-transparent backgrounds
2. THE Theme_Engine SHALL ensure text contrast meets WCAG AA standards (4.5:1 for body text) in light and dark modes
3. THE Theme_Engine SHALL provide appropriate text colors (dark text in light mode, light text in dark mode)
4. THE Theme_Engine SHALL adjust opacity of semi-transparent surfaces to maintain readability over gradients
5. THE Theme_Engine SHALL provide all icon buttons with accessibility labels
6. THE Theme_Engine SHALL ensure touch targets are minimum 44dp for buttons and interactive elements
7. THE Theme_Engine SHALL animate theme transitions with 300ms duration for smooth visual experience
8. THE Theme_Engine SHALL test readability with default gradients, solid colors, and user-custom colors
9. THE Theme_Engine SHALL provide visible focus indicators for keyboard navigation
10. THE Theme_Engine SHALL support dynamic type scaling respecting user's device font size settings

### Requirement 14: Data Persistence with AsyncStorage

**User Story:** As a user, I want my tasks and settings to persist after app restart, so that my data is always available when I return to the app.

#### Acceptance Criteria

1. THE Storage_Layer SHALL persist all tasks in AsyncStorage with key "tasks"
2. THE Storage_Layer SHALL persist all categories in AsyncStorage with key "categories"
3. THE Storage_Layer SHALL persist theme settings in AsyncStorage with key "theme_settings"
4. WHEN app launches, THE Storage_Layer SHALL load all data from AsyncStorage within 500ms
5. THE Storage_Layer SHALL serialize data to JSON format before storing
6. THE Storage_Layer SHALL deserialize JSON data when loading from AsyncStorage
7. WHEN storage operations fail, THE Storage_Layer SHALL display error message and retry once
8. THE Storage_Layer SHALL maintain data consistency ensuring all updates are atomic
9. THE Storage_Layer SHALL handle migration of data format changes gracefully with version checking
10. THE Storage_Layer SHALL never store sensitive data in plain text

### Requirement 15: Input Validation and Error Handling

**User Story:** As a user, I want clear validation messages and error handling, so that I understand what went wrong and how to fix it.

#### Acceptance Criteria

1. THE Task_Manager SHALL validate task title length between 1 and 120 characters before submission
2. THE Task_Manager SHALL validate task notes maximum length of 5000 characters before submission
3. THE Category_Manager SHALL validate category name length between 1 and 40 characters before submission
4. THE Category_Manager SHALL validate category name uniqueness before submission
5. WHEN validation fails, THE system SHALL display inline error messages below the relevant input field
6. WHEN storage operations fail, THE system SHALL display user-friendly error messages
7. WHEN AsyncStorage operations fail, THE system SHALL log detailed errors for debugging while showing generic messages to users
8. THE system SHALL handle loading states for all async operations with spinners or skeleton screens
9. THE system SHALL handle empty states with illustrations and helpful messages
10. THE system SHALL provide retry mechanisms for failed operations

### Requirement 16: Performance and Optimization

**User Story:** As a user, I want the app to be fast and responsive, so that I can manage tasks efficiently without delays.

#### Acceptance Criteria

1. THE Task_Manager SHALL render the task list within 500ms of data load completion
2. THE Task_Manager SHALL use virtualized list rendering for lists exceeding 50 items
3. THE Search_Engine SHALL debounce search input with 300ms delay to reduce unnecessary renders
4. THE Theme_Engine SHALL apply theme changes within 100ms of user selection
5. THE system SHALL update the UI immediately for user actions showing changes within 50ms
6. THE system SHALL cache task and category data in memory for instant access
7. THE system SHALL load tasks and categories from AsyncStorage in parallel on app launch
8. THE system SHALL lazy-load screens and components not needed on initial app launch
9. THE system SHALL minimize re-renders using React.memo and useCallback for expensive components
10. THE Notification_Scheduler SHALL schedule notifications in background without blocking UI thread

### Requirement 17: Development Environment and Compatibility

**User Story:** As a developer, I want the app to run in Expo Go without custom native builds and be compatible with Expo SDK 54, so that development and testing are streamlined.

#### Acceptance Criteria

1. THE system SHALL use Expo SDK version 54.0.19 without custom dev builds
2. THE system SHALL run successfully in Expo Go on Android with New Architecture compatibility
3. THE system SHALL install all dependencies using npx expo install to ensure SDK compatibility
4. THE system SHALL use TypeScript in strict mode with proper type definitions
5. THE system SHALL use Expo Router for navigation matching SDK 54 specifications
6. THE system SHALL use react-native-reanimated v4 with react-native-worklets as shipped with SDK 54
7. THE system SHALL pass npx expo-doctor validation without warnings
8. THE system SHALL support Node.js version 20.19.4 or newer
9. THE system SHALL never include native code or modules requiring custom builds
10. THE system SHALL document all environment setup requirements in README

### Requirement 18: Code Quality and Documentation

**User Story:** As a developer, I want clean, well-documented code with no placeholders, so that the codebase is maintainable and production-ready.

#### Acceptance Criteria

1. THE system SHALL use small, reusable components with single responsibility
2. THE system SHALL place AsyncStorage operations in features/*/storage layer, not directly in screens
3. THE system SHALL include code comments explaining learning focus and non-obvious logic
4. THE system SHALL use consistent naming conventions (PascalCase for components, camelCase for functions)
5. THE system SHALL never include TODO comments or placeholder implementations
6. THE system SHALL never include hardcoded test data in production code
7. THE system SHALL provide comprehensive README with setup instructions, tech stack, and architecture overview
8. THE system SHALL include inline documentation for complex algorithms and business logic
9. THE system SHALL use ESLint and TypeScript to enforce code quality standards
10. THE system SHALL organize code in feature-based folder structure (tasks, categories, theme, notifications)

