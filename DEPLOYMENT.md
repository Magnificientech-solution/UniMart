# UniMart Deployment Guide

This document provides step-by-step instructions for deploying UniMart on Render.

## Prerequisites

- A GitHub account with this repository cloned/forked
- A Render account (free tier is sufficient for testing)
- A Stripe account for payment processing
- A PostgreSQL database (Render provides this)

## Step 1: Create PostgreSQL Database on Render

1. Log in to your Render dashboard
2. Click on "New" and select "PostgreSQL"
3. Fill in the following details:
   - Name: unimart-db (or your preferred name)
   - Database: unimart
   - User: (leave as default)
   - Region: Choose the one closest to your users
   - Plan: Free
4. Click "Create Database"
5. Once created, note the "External Database URL" for the next step

## Step 2: Set Up Environment Variables

1. In Render dashboard, go to "Environment Groups"
2. Click "New Environment Group"
3. Name: unimart-env
4. Add the following environment variables:
   ```
   DATABASE_URL=[Your PostgreSQL connection URL from Step 1]
   NODE_ENV=production
   SESSION_SECRET=[Generate a random string]
   STRIPE_SECRET_KEY=[Your Stripe Secret Key]
   VITE_STRIPE_PUBLIC_KEY=[Your Stripe Public Key]
   ```
5. Click "Save Changes"

## Step 3: Deploy Web Service

1. From Render dashboard, click "New" and select "Web Service"
2. Connect your GitHub repository
3. Fill in the following details:
   - Name: unimart (or your preferred name)
   - Environment: Node
   - Region: Same as your database
   - Branch: main
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Free
4. Under "Advanced" settings, add your environment group "unimart-env"
5. Click "Create Web Service"

## Step 4: Run Database Migrations

1. After deployment completes, go to your web service in Render
2. Click "Shell"
3. Run the following command to set up your database tables:
   ```
   npm run db:push
   ```

## Step 5: Create Admin User

1. Open your deployed application
2. Go to /auth and register a new user
3. Access the PostgreSQL database through Render's dashboard
4. Run the following SQL to make your user an admin:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

## Step 6: Access Admin Portal

1. Log in with your admin user
2. Navigate to /admin-dashboard to access the admin portal
3. From there you can manage:
   - Users (customers and vendors)
   - Products and categories
   - Orders and transactions
   - Analytics and reporting

## Troubleshooting

- If you encounter database connection issues, verify your DATABASE_URL is correct
- If Stripe payments aren't working, check your Stripe API keys
- For any other issues, check the Render logs for your web service

## Production Considerations

- For production use, consider upgrading to a paid Render plan
- Set up a custom domain in the Render dashboard
- Enable automatic deployments for your GitHub repository
- Configure Stripe webhooks for production use