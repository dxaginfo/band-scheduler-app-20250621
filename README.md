# 🎸 Band Rehearsal Scheduler

A comprehensive web application for bands and musical groups to schedule rehearsals, track member availability, manage song lists, and coordinate performances.

## 🌟 Features

### User Management
- Secure user authentication and profile management
- Band creation and member invitations
- Role-based permissions (band leaders, members)
- Instrument tracking for each member

### Scheduling
- Availability management with recurring schedules
- Smart scheduling that suggests optimal rehearsal times
- Conflict detection to avoid double-booking
- Calendar views with personal calendar integration (Google, Apple)

### Rehearsal Management
- Rehearsal creation with location, duration, and purpose details
- RSVP functionality for members
- Automated reminders before rehearsals
- Attendance tracking and history

### Song Management
- Song library with status tracking
- Resource attachment (chord charts, lyrics, recordings)
- Rehearsal focus planning - assign songs to specific rehearsals
- Progress tracking for songs over time

### Setlist Management
- Create and organize setlists for performances
- Drag and drop interface for arranging songs
- Rehearsal integration - practice specific setlists

### Analytics
- Attendance statistics and insights
- Song progress visualization
- Rehearsal efficiency metrics

## 🛠️ Technology Stack

### Frontend
- React.js with Next.js
- Redux Toolkit for state management
- Material-UI component library
- React Big Calendar for scheduling views
- Formik with Yup for form handling
- Axios for API communication

### Backend
- Node.js with Express.js
- RESTful API architecture
- JWT authentication
- Socket.io for real-time updates

### Database
- PostgreSQL for relational data storage
- Redis for caching and pub/sub messaging

### DevOps
- Docker containerization
- GitHub Actions for CI/CD
- AWS deployment (Elastic Beanstalk, RDS, S3)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL
- Redis
- Docker (optional)

### Installation

1. Clone the repository
```bash
git clone https://github.com/dxaginfo/band-scheduler-app-20250621.git
cd band-scheduler-app-20250621
```

2. Install dependencies
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

3. Configure environment variables
```bash
# In the server directory
cp .env.example .env
# Edit .env with your database credentials and other settings
```

4. Set up the database
```bash
# In the server directory
npm run db:setup
```

5. Start the development servers
```bash
# Start the backend server
cd server
npm run dev

# In a new terminal, start the frontend
cd client
npm run dev
```

6. Access the application at http://localhost:3000

### Using Docker
```bash
# Build and start all services
docker-compose up -d
```

## 📂 Project Structure

```
├── client                # Frontend React application
│   ├── public            # Static files
│   └── src               # React source code
│       ├── components    # Reusable components
│       ├── pages         # Page components
│       ├── redux         # Redux state management
│       ├── services      # API services
│       └── utils         # Utility functions
│
├── server                # Backend Node.js application
│   ├── config            # Configuration files
│   ├── controllers       # Route controllers
│   ├── db                # Database models and migrations
│   ├── middleware        # Express middleware
│   ├── routes            # API routes
│   └── services          # Business logic
│
├── docs                  # Documentation
└── docker-compose.yml    # Docker configuration
```

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- HTTPS enforcement

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile phones

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For questions or support, please email: dxag.info@gmail.com