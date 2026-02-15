# Voting App

A simple voting/polling application built with Node.js, Express, MongoDB, and Twitter OAuth authentication.

## Features

- Create and share polls with multiple options
- Vote on polls and view results with interactive pie charts
- Twitter authentication for user management
- View your personal poll history

## Prerequisites

- Node.js >= 14.0.0
- MongoDB (local or cloud instance)
- Twitter Developer Account (for OAuth credentials)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/voting-app.git
   cd voting-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:
   - `TWITTER_CONSUMER_KEY` - Your Twitter API consumer key
   - `TWITTER_CONSUMER_SECRET` - Your Twitter API consumer secret
   - `TWITTER_CALLBACK_URL` - OAuth callback URL (default: http://localhost:3000/auth/twitter/callback)
   - `MONGODB_URI` - MongoDB connection string
   - `SESSION_SECRET` - Secure random string for session encryption
   - `PORT` - Server port (optional, defaults to 3000)

## Usage

Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Project Structure

```
voting-app/
├── app/
│   ├── api/             # API routes
│   ├── models/          # Mongoose models
│   └── routes.js        # Express routes
├── config/
│   ├── auth.js          # OAuth configuration
│   ├── database.js      # Database configuration
│   └── passport.js      # Passport.js setup
├── views/               # EJS templates
├── server.js            # Application entry point
├── package.json
└── .env.example         # Environment variables template
```

## Technologies

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Twitter OAuth 1.0a
- **Frontend**: EJS templates, Bootstrap 3, Chart.js
- **Security**: Express-session, cookie-parser

## License

ISC
