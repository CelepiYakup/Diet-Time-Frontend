# Diet Time Frontend

This is the frontend application for Diet Time, built with Next.js and React.

## Project Structure

```
src/
├── api/         # API client and service integrations
├── app/         # Next.js App Router pages and components
│   ├── components/   # Reusable UI components
│   ├── context/      # React Context providers
│   ├── dashboard/    # Dashboard views
│   ├── features/     # Feature-specific components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   ├── login/        # Authentication pages
│   ├── meals/        # Meal tracking features
│   ├── register/     # User registration
│   ├── services/     # Business logic services
│   ├── styles/       # Global and component styles
│   └── types/        # TypeScript type definitions
├── public/      # Static assets
```

## Technologies

- Next.js 14 with App Router
- React 18
- TypeScript
- Sass/SCSS for styling
- Chart.js for data visualization
- Axios for API requests
- React Icons for UI icons
- Docker for containerization

## Features

- User authentication (login/register)
- Dashboard with nutrition analytics
- Meal tracking and planning
- Diet plan management
- Data export capabilities (XLSX)
- Responsive design for mobile and desktop

## Development Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create environment file:
   ```
   cp .env.example .env.local
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

5. Build for production:
   ```
   npm run build
   ```

6. Start production server:
   ```
   npm start
   ```

## Running with Docker

You can also run the application using Docker:

1. Create the environment file:
   ```
   cp .env.example .env.local
   ```

2. Build and start the container:
   ```
   docker-compose up -d
   ```

3. The frontend application will be available at http://localhost:3000.

## About Diet Time

Diet Time is an application designed to help users manage their diet plans, track nutrition, and achieve their health goals. Key features include:

- Personalized diet plans
- Calorie and macronutrient tracking
- Meal scheduling and planning
- Progress visualization
- Nutrition recommendations

## Environment Variables

The following environment variables can be configured:

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Learn More About Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deployment

The application can be deployed to Vercel or any other hosting platform that supports Next.js.


