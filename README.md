# To-Do List App

A simple, elegant mobile task management application built with Expo and React Native. Features local storage, categories, priorities, due dates, search, notifications, and customizable themes.

## Features

### Core Functionality
- ✅ **CRUD Operations**: Create, read, update, and delete tasks
- ✅ **Task Completion**: Mark tasks as complete/incomplete with checkbox
- ✅ **Categories**: Organize tasks with custom colored categories
- ✅ **Priority Levels**: Set low, medium, or high priority for tasks
- ✅ **Due Dates**: Add date and time to tasks
- ✅ **Search**: Real-time search across task titles and notes
- ✅ **Local Storage**: All data persists locally using AsyncStorage

### Enhanced Features
- 🔔 **Local Notifications**: Set reminders (at time, 10 min, 1 hour, or 1 day before)
- 🎨 **Theme System**: Light, dark, and system modes
- 🌈 **Custom Backgrounds**: Solid colors or gradient backgrounds
- 📋 **Task Grouping**: Filter by all, today, upcoming, or no date
- 📱 **Pull to Refresh**: Reload tasks with a simple swipe gesture

## Tech Stack

- **Framework**: Expo SDK 54.0.19
- **Language**: TypeScript (strict mode)
- **Navigation**: Expo Router v4
- **Storage**: @react-native-async-storage/async-storage
- **Notifications**: expo-notifications
- **UI**: react-native-reanimated v4, expo-linear-gradient
- **Date/Time**: @react-native-community/datetimepicker

## Prerequisites

- Node.js 20.19.4 or newer
- npm or yarn
- Expo Go app on your Android device (for testing)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd to-do-list
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Scan the QR code with Expo Go app on your Android device

## Project Structure

```
to-do-list/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout with providers
│   ├── index.tsx          # Main task list screen
│   ├── settings.tsx       # Theme settings screen
│   └── categories.tsx     # Category management screen
├── components/            # Reusable UI components
│   ├── TaskCard.tsx      # Individual task card
│   └── TaskForm.tsx      # Task creation/edit form
├── contexts/             # React contexts
│   ├── TaskContext.tsx   # Task and category state management
│   └── ThemeContext.tsx  # Theme state management
├── types/                # TypeScript type definitions
│   └── index.ts
├── utils/                # Utility functions
│   ├── storage.ts        # AsyncStorage wrapper
│   ├── notifications.ts  # Notification scheduling
│   └── dateHelpers.ts    # Date formatting and comparison
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript configuration
└── babel.config.js       # Babel configuration
```

## Usage

### Creating a Task
1. Tap the **+** button (FAB) on the home screen
2. Enter task title (required)
3. Optionally add:
   - Notes
   - Category
   - Priority (low/medium/high)
   - Due date and time
   - Reminder notification
4. Tap **Create**

### Editing a Task
1. Tap on any task card
2. Modify fields as needed
3. Tap **Update** to save or **Delete Task** to remove

### Completing a Task
- Tap the checkbox on the left of any task card
- Completed tasks show with strike-through text
- Tap again to mark as incomplete

### Managing Categories
1. Tap the 🏷️ icon in the header
2. Tap **+ Add** to create new categories
3. Choose a name and color
4. Tap on existing categories to edit
5. Swipe or tap ✕ to delete

### Customizing Theme
1. Tap the ⚙️ icon in the header
2. Select theme mode (light/dark/system)
3. Choose background type (solid/gradient)
4. Pick from preset colors or gradients
5. Changes save automatically

### Filtering Tasks
- Use the filter chips: **All**, **Today**, **Upcoming**, **No Date**
- Search bar filters in real-time across titles and notes

## Key Learning Concepts

### UI Design
- Component composition and reusability
- Responsive layouts with flexbox
- Theme-aware styling
- Gradient backgrounds and visual polish

### Events & State Management
- React Context for global state
- Optimistic UI updates
- Form validation and error handling
- Touch interactions and gestures

### Data Storage
- AsyncStorage for local persistence
- JSON serialization
- Data migrations and versioning
- Atomic operations

### Application Logic
- CRUD operations
- Search and filter algorithms
- Date/time calculations
- Notification scheduling

## Performance Optimizations

- Virtualized list rendering (FlatList)
- React.memo for expensive components
- useCallback for stable function references
- Debounced search input (300ms)
- Parallel data loading
- Optimistic updates for instant feedback

## Permissions

The app requests the following permissions:
- **Notifications**: For task reminders
- **Schedule Exact Alarm** (Android): For precise notification timing

## Troubleshooting

### App won't start
```bash
# Clear cache
npx expo start -c
```

### Dependencies issues
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Notification not working
- Check that notification permissions are granted
- Ensure device is not in Do Not Disturb mode
- Verify due date is set when creating reminder

## Future Enhancements

Potential features for future versions:
- Task recurring/repeating
- Subtasks/checklists
- Task attachments
- Export/import data
- Cloud sync (Firebase/Supabase)
- Multi-user support
- Task statistics and insights
- Widget support

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Author

Built as a learning project focusing on fundamental mobile app development concepts.
