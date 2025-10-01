# MovieFlix - Netflix-Style Streaming App

A beautiful, fully responsive Netflix-inspired streaming web application built with React, TypeScript, and Tailwind CSS.

## 🎬 Features

### 🎯 Core Functionality
- **Hero Banner** - Auto-rotating featured movies with smooth fade transitions
- **Movie Carousels** - Horizontal scrolling with drag/swipe support and snap scrolling
- **Movie Details** - Dedicated pages with blurred backgrounds and floating info cards
- **Video Player** - Custom Netflix-style controls with title overlay
- **My List** - Personal watchlist with localStorage persistence
- **Search** - Real-time filtering with expandable search bar
- **Responsive Design** - Mobile-first with hamburger menu and touch gestures

### 🎨 Enhanced UI/UX
- **Smart Navbar** - Transparent on load, turns solid when scrolling
- **Advanced Animations** - Smooth transitions, hover effects, and lazy loading
- **Touch Support** - Swipe gestures for mobile carousel navigation
- **Loading States** - Beautiful placeholders and skeleton screens
- **Empty States** - Engaging messaging when lists are empty

### 📱 Mobile Experience
- **Hamburger Menu** - Clean mobile navigation
- **Touch Gestures** - Swipe support for all carousels
- **Responsive Cards** - Adaptive layouts for all screen sizes
- **Mobile Search** - Full-screen search overlay on mobile

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation & Development

```bash
# Clone the repository
git clone <your-repo-url>
cd movieflix

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation with scroll detection
│   ├── HeroBanner.tsx  # Auto-rotating hero section
│   ├── Carousel.tsx    # Swipeable movie carousels
│   ├── MovieCard.tsx   # Enhanced movie cards with lazy loading
│   └── VideoPlayer.tsx # Custom Netflix-style video player
├── pages/              # Page components
│   ├── Index.tsx       # Homepage with all carousels
│   ├── MovieDetail.tsx # Movie detail pages
│   ├── MyList.tsx      # User's personal watchlist
│   └── SearchResults.tsx # Search results page
├── hooks/              # Custom React hooks
│   ├── useScrollPosition.tsx # Scroll detection for navbar
│   └── useTouchSwipe.tsx     # Touch gesture support
├── data/
│   └── movies.json     # Mock movie data (20 movies)
└── assets/             # Generated images and static files
```

## 🎨 Design System

### Color Palette
- **Netflix Red**: `hsl(0 100% 45%)` - Primary brand color
- **Deep Black**: `hsl(0 0% 8%)` - Background
- **Surface Gray**: `hsl(0 0% 12%)` - Cards and overlays
- **Border Gray**: `hsl(0 0% 20%)` - Subtle borders

### Animations
- **Hero Transitions**: 1s fade between featured movies
- **Card Hover**: Scale + shadow effects with 0.3s timing
- **Page Transitions**: Smooth fade-in animations
- **Loading States**: Skeleton shimmer animations

## 🛠️ Technical Features

### Performance Optimizations
- **Lazy Loading** - Images load as they enter viewport
- **Smooth Scrolling** - Hardware-accelerated carousel scrolling
- **Touch Optimization** - Responsive touch events with proper debouncing
- **Memory Management** - Proper cleanup of intervals and event listeners

### Responsive Breakpoints
- **Mobile**: `< 768px` - Single column, hamburger menu
- **Tablet**: `768px - 1024px` - 2-3 columns, condensed layout
- **Desktop**: `> 1024px` - Full layout with 4-6 columns

### Accessibility
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader** - Proper ARIA labels and semantic HTML
- **Focus Management** - Visible focus indicators
- **Color Contrast** - WCAG AA compliant contrast ratios

## 📊 Mock Data

The app includes 20 carefully curated movies with:
- **Diverse Genres** - Action, Sci-Fi, Romance, Horror, Comedy, etc.
- **Rich Metadata** - Titles, descriptions, ratings, years, durations
- **Categories** - Trending Now, Top Picks, New Releases, Continue Watching
- **High-Quality Images** - Professional movie thumbnails and hero images

## 🎯 Key Interactions

### Navigation
- **Logo Click** - Returns to homepage
- **Menu Items** - Navigate to different sections
- **Search** - Expands on click, filters in real-time
- **Profile** - Dropdown with user options

### Movie Discovery
- **Hero Banner** - Auto-rotates every 8 seconds, manual controls
- **Carousels** - Scroll with mouse, arrow keys, or touch swipe
- **Movie Cards** - Hover for actions, click for details
- **Search** - Type to filter across all movies

### Playback
- **Play Buttons** - Launch custom video player
- **Video Controls** - Play/pause, seeking, volume, fullscreen
- **My List** - Add/remove movies with visual feedback

## 🔧 Customization

### Adding Movies
Edit `src/data/movies.json` to add new content:

```json
{
  "id": 21,
  "title": "Your Movie",
  "description": "Movie description...",
  "thumbnail": "https://your-image-url.jpg",
  "heroImage": "https://your-hero-image-url.jpg",
  "videoUrl": "https://your-video-url.mp4",
  "year": 2024,
  "genre": "Action",
  "category": "Trending Now",
  "duration": "2h 15m",
  "rating": "8.5"
}
```

### Styling
The design system is defined in:
- `src/index.css` - CSS custom properties and component classes
- `tailwind.config.ts` - Tailwind configuration and custom animations

### Components
All components are TypeScript-first with proper interfaces and full IntelliSense support.

## 📱 Browser Support

- **Chrome/Edge**: Full support
- **Firefox**: Full support  
- **Safari**: Full support (iOS 12+)
- **Mobile**: Optimized for all modern mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly across devices
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using React, TypeScript, and Tailwind CSS