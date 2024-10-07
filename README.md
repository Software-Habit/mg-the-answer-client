# theAnswer UI

theAnswer UI is a magazine subscription data tracking and analytics tool designed to sync data from the ReCharge API and store it in a MongoDB Atlas database. This application enables magazine companies to manage their subscription, charge, and customer data efficiently without relying on real-time ReCharge API calls for analysis. Additionally, theAnswer UI supports secure export file storage using Amazon S3.

## Features

- **Data Syncing**: Automatically sync charges, subscriptions, and customers from ReCharge to MongoDB Atlas.
- **Efficient Data Access**: Analyze data quickly and effectively without being dependent on real-time API responses.
- **Amazon S3 Integration**: Securely store export files and generate signed download links for safe data sharing.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm, yarn, pnpm, or bun

### Installation

Clone the repository:

```bash
git clone https://github.com/your-repo/theAnswer-UI.git
cd theAnswer-UI
```

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

You can start editing the pages by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [Next.js Font Optimization](https://nextjs.org/docs/basic-features/font-optimization) for enhanced performance, including the automatic loading of custom Google Fonts.

## API Endpoints

### Subscriptions Sync

This endpoint syncs subscription data from ReCharge to MongoDB Atlas.

- **Endpoint**: `{{api_url}}/subscriptions/sync`
- **Method**: `POST`
- **Body Example**:

```json
{
  "sync_limit": 2000,
  "max_days_since_update": "2"
}
```

- **Parameters**:
  - `sync_limit`: The maximum number of subscriptions to sync in one operation.
  - `max_days_since_update`: Limits the sync to subscriptions updated in the last specified number of days. Leaving this empty syncs all data.

### Charges Sync

This endpoint syncs charge data from ReCharge to MongoDB Atlas.

- **Endpoint**: `{{api_url}}/charges/sync`
- **Method**: `POST`
- **Body Example**:

```json
{
  "sync_limit": 2000,
  "max_days_since_update": "2"
}
```

- **Parameters**:
  - `sync_limit`: The maximum number of charges to sync in one operation.
  - `max_days_since_update`: Limits the sync to charges updated in the last specified number of days. Setting this to `"2"` syncs charges from the last 2 days.

### Scheduled Syncs

Both sync endpoints can be scheduled as cron jobs to automate data syncing at regular intervals. The `max_days_since_update` parameter is used to optimize sync efficiency by only fetching the most recent changes, reducing the load on the ReCharge API and speeding up data processing.

## Storage

TheAnswer UI integrates with Amazon S3 to store export files securely. Signed download links are generated for added security, ensuring only authorized users can access stored files.

## Learn More

To learn more about the frameworks and services used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn more about the features and APIs available in Next.js.
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/) - Learn about MongoDB Atlas and its capabilities.
- [Amazon S3 Documentation](https://aws.amazon.com/s3/) - Explore how Amazon S3 can be used to securely store data.
- [ReCharge API Documentation](https://developer.rechargepayments.com/) - Understand the ReCharge API endpoints and data models.

## Deployment

This application has historically been deployed on Heroku and MongoDB Atlas.