# Monthly Habit Tracker - DISCIPLINE

A comprehensive full-stack monthly habit tracking application built with React, TypeScript, and Tailwind CSS.

## Features

### 🎯 Core Features

1. **Monthly Habit Protocol Grid**
   - Interactive grid with habits as rows and days (1-31) as columns
   - Click cells to toggle between: empty → checkmark (✓) → X mark → empty
   - Color coded: green for completed, red for skipped
   - 16 default habits included (Reading, Meditation, Study, Gym, etc.)
   - Add, edit, and delete custom habits
   - Data persisted in localStorage

2. **Progress Chart**
   - Line chart tracking discipline score over 31 days
   - Daily score calculated as (checkmarks / total habits) × 10
   - Shows average, trend, and best day statistics
   - Smooth line with dotted grid background

3. **Level System**
   - 12 levels from Beginner to Transcendent
   - XP earned for completing habits, perfect days, logging mood/screen time
   - Progress bar showing XP to next level
   - Visual level badge with stars

4. **Mood Tracker**
   - 5 emoji options: Very Happy 😊, Happy 🙂, Neutral 😐, Sad 😞, Very Sad 😢
   - Grid format for all 31 days
   - Shows mood distribution and average

5. **Screen Time Tracker**
   - Daily screen time input in hours
   - Color coded: Green (≤2h), Yellow (2-4h), Red (>4h)
   - Weekly averages and trends
   - Warning for high screen time

6. **Monthly Performance Report**
   - Completion percentage
   - Most/least consistent habits
   - Screen time comparison with previous month
   - Streak statistics
   - Average mood score
   - Personalized insights

### ✨ Additional Features

- **Streak Counter**: Track consecutive perfect days with milestone progress
- **Daily Motivational Quotes**: Rotating inspirational quotes
- **Today's Summary**: Real-time progress tracking for the current day
- **Dark Mode**: Toggle between light and dark themes
- **Export**: Download data as JSON or CSV
- **Month Navigation**: Browse previous/next months
- **Confetti Animation**: Celebration when completing all habits
- **Responsive Design**: Works on mobile and desktop

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: React Context API + useReducer
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Notifications**: react-hot-toast
- **Animations**: canvas-confetti
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   cd "Monthly Tracker"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── HabitGrid.tsx        # Main habit tracking grid
│   ├── ProgressChart.tsx    # Progress line chart
│   ├── LevelDisplay.tsx     # Level and XP display
│   ├── MoodTracker.tsx      # Daily mood tracking
│   ├── ScreenTimeCard.tsx   # Screen time tracking
│   ├── MonthlyReport.tsx    # Performance report
│   ├── Header.tsx           # App header with navigation
│   ├── StreakCounter.tsx    # Streak display
│   ├── MotivationalQuote.tsx # Daily quotes
│   └── TodaySummary.tsx     # Today's progress
├── context/
│   └── TrackerContext.tsx   # Global state management
├── types/
│   └── index.ts             # TypeScript interfaces
├── utils/
│   ├── calculations.ts      # Score/XP calculations
│   ├── constants.ts         # Default data & config
│   ├── dateUtils.ts         # Date helper functions
│   └── storage.ts           # LocalStorage helpers
├── App.tsx                  # Main app component
├── main.tsx                 # Entry point
└── index.css                # Global styles
```

## Data Persistence

All data is automatically saved to localStorage:
- Habit completion status
- Mood entries
- Screen time data
- Level and XP
- Dark mode preference

Data is saved per month, allowing you to view historical data.

## Customization

### Adding Default Habits

Edit `src/utils/constants.ts` and add to the `DEFAULT_HABITS` array:

```typescript
{ id: 'new-habit', name: 'New Habit Name', isDefault: true }
```

### Modifying Levels

Edit the `LEVELS` array in `src/utils/constants.ts` to adjust XP requirements.

### Adding Quotes

Add new quotes to the `QUOTES` array in `src/utils/constants.ts`.

## License

MIT License - feel free to use and modify as needed!

---

**Built with discipline 💪 | Track your habits. Build your future.**
