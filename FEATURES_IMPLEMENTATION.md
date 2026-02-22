# Features Implementation Guide

This document explains how specific interactive features like animations, clocks, and calendars are implemented in the project.

## 1. Animations (Framer Motion)
Most animations in the dashboard are powered by **Framer Motion**.
- **Dashboard Transitions**: In `Dashboard.tsx`, we use `<AnimatePresence mode="wait">` combined with `<motion.div>`. When you switch between tabs (Home, Tasks, Calendar), the old content fades/slides out while the new content entry-animates.
- **Micro-interactions**: Buttons and cards use the `whileHover={{ scale: 1.02 }}` and `whileTap={{ scale: 0.98 }}` props to give tactile feedback.
- **Splash Cursor**: The project includes a `SplashCursor.tsx` component that uses a high-performance canvas-based animation to follow the user's mouse pointer, creating a premium feel.

## 2. Calendar View
The calendar feature is implemented in `components/CalendarView.tsx`.
- **Logic**: It uses `date-fns` to calculate the days of the current month and align them with the correct weekdays.
- **Integration**: It maps over the `tasks` array and filters them by date to display task indicators on specific calendar days.
- **Interaction**: Users can click on a day to view tasks due on that specific date.

## 3. Date & Time Selection
To ensure a smooth user experience when creating tasks:
- **Calendar Picker**: We use `react-datepicker` for selecting due dates. It has been customized via `datepicker-custom.css` to match the dashboard's "Vi Task" aesthetic.
- **Time Selection**: The `TimePicker.tsx` component provides a custom interface for selecting HH:MM precisely without relying on browser-default inputs, which can be inconsistent across devices.

## 4. Real-time Clock
In the `Dashboard.tsx` header and "Home" tab:
- **Greeting Logic**: A `useMemo` hook calculates whether to say "Good Morning," "Afternoon," or "Evening" based on the current system time (`new Date().getHours()`).
- **Display**: The current date is formatted using `date-fns` (`format(new Date(), "dd MMM yyyy")`) to provide a sleek, updated look every time the dashboard is opened.

## 5. Security Features
- **Hidden Password Logic**: The `ChangePasswordModal.tsx` handles sensitive updates by requiring the old password or a "Recovery Pin" (set during registration) to ensure only the account owner can change credentials.
- **Input Validation**: `react-hook-form` ensures that users cannot submit empty tasks or invalid dates, with real-time error messages provided by `react-hot-toast`.

## 6. Personalization (Visual Protocol)
- **Neural Palette**: Located in the Settings tab, this allows users to change the `--color-primary` CSS variable dynamically. This color then propagates to all buttons, icons, and accents across the entire application instantly.
- **Luminance Mode**: A toggle that shifts the entire application between a deep dark theme and a clean light theme by swapping the `--color-background` and `--color-text` variables.
