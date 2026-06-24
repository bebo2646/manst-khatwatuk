# Learning Hub - Modern Educational Platform

## 🎓 Project Overview

Learning Hub is a modern, responsive educational web platform featuring structured courses across multiple computing fields, user authentication, and an intuitive dashboard with YouTube video integration.

## ✨ Recent Improvements (v2.0)

### 🏗️ Project Structure
- **Complete reorganization** into logical folders:
  - `/pages` - HTML pages
  - `/styles` - CSS stylesheets (unified theme system)
  - `/scripts` - JavaScript files
  - `/assets` - Images and media (future use)
- **Removed duplicates**: Eliminated redundant learning-hub-admin folder and unused create_admin.js

### 🎨 Unified Design System
- **Modern theme system** with consistent design tokens:
  - Primary color: `#7494ec` (professional blue)
  - Dark, Light, and Beige themes
  - Comprehensive CSS variables for spacing, typography, and colors
  - Glassmorphism effects with backdrop blur
  
### 🔐 Authentication (Auth Pages)
- Modern, unified login/registration interface
- Split-panel design with branding on one side
- Responsive grid layout (2 columns on desktop, 1 on mobile)
- Social login buttons (Google, GitHub, LinkedIn)
- Smooth theme switching
- Enhanced spacing and visual hierarchy

### 📚 Dashboard Redesign
**Complete transformation from simple courses list to a professional educational platform:**

1. **Navigation System**
   - Sticky header with smooth scrolling
   - Main navigation with 7 categories: Featured, Cybersecurity, Programming, AI & ML, Networking, Web Dev, Data Science
   - Theme switcher and user profile menu
   - Responsive collapsing on mobile

2. **YouTube Video Grid Layout**
   - Responsive grid: 4 columns on desktop → 3 on tablet → 1 on mobile
   - 16:9 aspect ratio video thumbnails
   - Play button overlay on hover
   - Course metadata (duration, difficulty level)
   - Enroll/Preview buttons

3. **Course Categories**
   - **Cybersecurity**: Ethical hacking, network security, cryptography
   - **Programming**: JavaScript, C++, Java, Go
   - **AI & ML**: Deep learning, NLP, computer vision, reinforcement learning
   - **Networking**: TCP/IP, advanced routing, 5G, cloud networking
   - **Web Development**: React, Vue, Node.js, full-stack
   - **Data Science**: Pandas, visualization, statistics, big data
   - **Featured**: Trending courses

4. **Additional Features**
   - Hero section with call-to-action buttons
   - Statistics display (courses, learners, countries)
   - "My Courses" section for enrolled courses
   - Video modal player
   - Responsive footer with social links
   - Empty states with helpful messaging

### 🎯 UI/UX Enhancements
- **Increased spacing** across all pages:
  - Padding: 12px → 16-20px+
  - Margins: 10px → 16px+
  - Section gaps: 12px → 24px+
  - Create breathing room for cleaner look

- **Modern typography**:
  - Clear hierarchy with scaled font sizes
  - Line heights optimized for readability
  - Better font pairing (Cairo for headings, Inter for body)

- **Visual improvements**:
  - Smooth transitions (150ms-350ms)
  - Hover effects with transforms
  - Consistent border radius (6px-20px)
  - Enhanced shadows for depth
  - Better contrast ratios

### 📱 Responsive Design
- **Desktop**: Full 4-column grid, full navigation
- **Tablet (1024px)**: 3-column grid, adjusted spacing
- **Mobile (768px)**: 2-column grid, wrapped navigation
- **Small phones (480px)**: 1-column, optimized touch targets

### 🔧 Technical Improvements
- **Better code organization**:
  - Separated concerns (HTML, CSS, JS in dedicated folders)
  - Consistent file naming conventions
  - Modular CSS with custom properties
  - Clean, maintainable JavaScript

- **Performance**:
  - Reduced HTTP requests through folder organization
  - Optimized CSS with modern features
  - Efficient event delegation
  - Lazy-loaded video embeds

- **Accessibility**:
  - Semantic HTML structure
  - ARIA labels where needed
  - Keyboard navigation support
  - High contrast themes
  - Proper heading hierarchy

- **Cross-browser compatibility**:
  - CSS custom properties with fallbacks
  - Vendor prefixes where needed
  - Tested on modern browsers

## 📂 Project Structure

```
learning-hub/
├── server.js                 # Express server
├── db.js                     # SQLite database setup
├── package.json              # Dependencies
│
├── data/
│   └── database.sqlite       # SQLite database file
│
└── public/
    ├── pages/
    │   ├── index.html        # Login/Registration
    │   ├── dashboard.html    # Main dashboard with video grid
    │   ├── admin.html        # Admin panel
    │   └── contact.html      # Contact page
    │
    ├── styles/
    │   ├── theme.css         # Unified theme system
    │   ├── auth.css          # Auth pages styling
    │   ├── dashboard.css     # Dashboard styling
    │   └── admin.css         # Admin panel styling
    │
    ├── scripts/
    │   ├── auth.js           # Login/registration logic
    │   ├── dashboard.js      # Dashboard interactions
    │   └── admin.js          # Admin panel logic
    │
    └── assets/               # For future images/media
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

```bash
# Clone or extract the project
cd learning-hub

# Install dependencies
npm install

# Initialize the database
npm run setup-db

# Start the development server
npm start
```

The app will be available at `http://localhost:5000`

### Development Mode

```bash
npm run dev  # Runs with nodemon for auto-restart
```

## 🔑 Key Features

### Authentication
- **Registration**: Create account with username, email, password
- **Login**: Secure authentication with bcrypt hashing
- **Session management**: Uses localStorage for client-side user persistence

### Dashboard
- Browse 28+ courses across 7 categories
- YouTube video player integration
- Enroll/unenroll in courses
- Track enrolled courses
- Responsive grid layout

### Admin Panel
- Create, edit, delete courses
- View user statistics
- Manage course metadata
- Admin-only access control

### Themes
- **Dark** (default) - Easy on the eyes
- **Light** - Bright and clean
- **Beige** - Warm and professional

## 🎨 Design System

### Colors
```css
--primary: #7494ec        /* Main action color */
--primary-dark: #5f7fd4   /* Darker variant */
--primary-light: #8da5f5  /* Lighter variant */
--success: #3fb950        /* Success states */
--error: #d1242f          /* Error states */
--warning: #d29922        /* Warning states */
```

### Spacing Scale
- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 12px
- `--space-4`: 16px
- `--space-5`: 20px
- `--space-6`: 24px
- `--space-7`: 32px
- `--space-8`: 40px

## 📡 API Endpoints

### User Management
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/enroll` - Enroll in course
- `GET /api/my-enrollments` - Get user's enrolled courses

### Admin
- `POST /api/admin/course` - Create course
- `PUT /api/admin/course/:id` - Update course
- `DELETE /api/admin/course/:id` - Delete course
- `GET /api/is-admin` - Check if user is admin

## 🛡️ Security

- Passwords hashed with bcrypt (salt rounds: 10)
- SQL injection prevention through parameterized queries
- Admin-only endpoints protected
- CORS enabled for cross-origin requests

## 📊 Database Schema

### Users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  password_hash TEXT,
  is_admin INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Courses
```sql
CREATE TABLE courses (
  id INTEGER PRIMARY KEY,
  title TEXT,
  description TEXT,
  image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Enrollments
```sql
CREATE TABLE enrollments (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(course_id) REFERENCES courses(id)
)
```

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Android)

## 🎯 Future Enhancements

- [ ] User progress tracking
- [ ] Certificate generation
- [ ] Course rating and reviews
- [ ] Discussion forums
- [ ] Live instructor sessions
- [ ] Mobile app (React Native)
- [ ] Payment integration
- [ ] Advanced analytics dashboard
- [ ] Personalized learning paths
- [ ] Gamification (badges, leaderboards)

## 📝 Notes

- The dashboard now displays YouTube video content across multiple categories
- All courses are currently using YouTube video links for demonstrating the platform
- The enrollment system uses one-time codes for registration (VIP2025, FREE100, ABC123, TRIAL50)
- Admin credentials can be set directly in the database or through the API

## 🤝 Contributing

This is a learning project. Contributions and suggestions are welcome!

## 📄 License

Open source educational platform.

---

**Built with ❤️ for learners worldwide**
