# C-Tech Solutions Platform

A comprehensive online learning platform for Islamic studies, programming, and academic courses.

## 🚀 Features

- **User Authentication & Profiles** - Secure login, registration, and profile management
- **Course Management** - Browse, enroll, and track progress in various courses
- **Resource Library** - Access study materials, PDFs, videos, and educational content
- **Dashboard & Analytics** - Personal learning dashboard with progress tracking
- **Responsive Design** - Mobile-first design that works on all devices
- **RESTful API** - Full backend API for data management

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate limiting
- **Deployment**: Docker, Docker Compose, Nginx

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- MongoDB 5.0+
- Docker and Docker Compose (for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd my-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:setup
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000` (frontend) and `http://localhost:5000` (backend).

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Set up database (first time only)**
   ```bash
   docker-compose exec app npm run db:setup
   docker-compose exec app npm run db:seed
   ```

The application will be available at `http://localhost` (port 80).

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/ctech_solutions` |
| `JWT_SECRET` | JWT signing secret | *Required* |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `CLIENT_URL` | Frontend URL | `http://localhost:3000` |
| `BCRYPT_ROUNDS` | Password hashing rounds | `12` |

### MongoDB Setup

For local development, install MongoDB and start the service:
```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS with Homebrew
brew services start mongodb-community
```

For production, consider using MongoDB Atlas (cloud) or a managed database service.

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-password` - Update password
- `POST /api/auth/logout` - User logout

### User Endpoints

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/dashboard` - Get dashboard data
- `POST /api/users/enroll/:courseId` - Enroll in course
- `PUT /api/users/progress/:courseId` - Update course progress

### Course Endpoints

- `GET /api/courses` - Get all courses (with filtering)
- `GET /api/courses/popular` - Get popular courses
- `GET /api/courses/:id` - Get specific course
- `GET /api/courses/search/:query` - Search courses

### Resource Endpoints

- `GET /api/resources` - Get all resources (with filtering)
- `GET /api/resources/category/:category` - Get resources by category
- `GET /api/resources/:id` - Get specific resource
- `POST /api/resources/:id/like` - Like/unlike resource

## 🗂️ Project Structure

```
├── server/              # Backend server files
│   ├── server.js        # Main server file
│   ├── setup-db.js      # Database setup script
│   └── seed-db.js       # Database seeding script
├── models/              # MongoDB schemas
│   ├── User.js          # User model
│   ├── Course.js        # Course model
│   └── Resource.js      # Resource model
├── routes/              # API routes
│   ├── auth.js          # Authentication routes
│   ├── users.js         # User routes
│   ├── courses.js       # Course routes
│   └── resources.js     # Resource routes
├── middleware/          # Express middleware
│   └── auth.js          # Authentication middleware
├── C tech Solutions/    # Frontend files
│   ├── index.html       # Main HTML file
│   ├── style.css        # Styles
│   └── script.js        # Frontend JavaScript
├── nginx/               # Nginx configuration
│   └── nginx.conf       # Nginx config file
├── api-client.js        # Frontend API client
├── package.json         # Node.js dependencies
├── docker-compose.yml   # Docker Compose configuration
├── Dockerfile          # Docker image configuration
└── README.md           # This file
```

## 🔐 Security

- **Authentication**: JWT-based authentication with secure password hashing
- **Authorization**: Role-based access control (student, instructor, admin)
- **Data Validation**: Input validation and sanitization
- **Rate Limiting**: API rate limiting to prevent abuse
- **Security Headers**: Helmet.js for security headers
- **HTTPS**: SSL/TLS encryption (configure in nginx.conf)

## 🚀 Deployment

### Production Deployment Checklist

1. **Update environment variables**
   - Set strong JWT secret
   - Configure production MongoDB URI
   - Set NODE_ENV=production

2. **SSL Certificate**
   - Obtain SSL certificate (Let's Encrypt recommended)
   - Update nginx configuration

3. **Database**
   - Use MongoDB Atlas or managed MongoDB service
   - Set up database backups

4. **Monitoring**
   - Set up application monitoring
   - Configure log aggregation

5. **Performance**
   - Enable nginx caching
   - Configure CDN for static assets

### Deployment Platforms

The application can be deployed on:
- **VPS/Dedicated Server** with Docker
- **DigitalOcean App Platform**
- **Heroku** (with MongoDB Atlas)
- **AWS ECS/EC2**
- **Google Cloud Run**

## 👥 Default Users

After running the seed script, you can login with:

- **Admin**: admin@ctechsolutions.com / admin123456
- **Instructor**: instructor@ctechsolutions.com / instructor123
- **Student**: te25bca002@techethica.in / password

**⚠️ Change default passwords in production!**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: support@ctechsolutions.com
- Documentation: [Wiki](../../wiki)
- Issues: [GitHub Issues](../../issues)

## 🔄 Updates

- **v1.0.0** - Initial release with course management and authentication
- **v1.1.0** - Added resource library and user dashboard
- **v1.2.0** - Implemented Docker deployment and API improvements

---

Built with ❤️ by C-Tech Solutions Team
# sinan-s-profoilo-
