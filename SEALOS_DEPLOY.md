# Sealos Deployment

This app can run as one Node container. Express serves both the API and the built React frontend.

## Build Settings

- Image source: this repository
- Dockerfile: `Dockerfile`
- Container port: `3001`
- Health check path: `/api/health`

## Environment Variables

Set these in Sealos:

```txt
NODE_ENV=production
PORT=8080
```

Set this to use PostgreSQL:

```txt
DATABASE_URL=postgresql://user:password@host:5432/database
DB_POOL_MAX=5
```

If your PostgreSQL endpoint requires SSL:

```txt
PGSSLMODE=require
```

Set these if email notifications are required:

```txt
EMAIL_USER=your_qq_email@qq.com
EMAIL_PASS=your_qq_smtp_authorization_code
```

If email is not configured, submissions are still saved, but email delivery errors are logged.

## Persistent Storage

When `DATABASE_URL` is set, data is persisted in PostgreSQL and the JSON file is only used as an initial migration source.

When `DATABASE_URL` is not set, the app falls back to `data/data.json`. For the JSON fallback, mount a persistent volume at:

```txt
/app/data
```

Without a persistent volume, submitted records may be lost when the app is recreated.

## Recommended Production Upgrade

For real event-day usage, set `DATABASE_URL` and use PostgreSQL. On first startup with an empty PostgreSQL database, the app creates tables, seeds schools/students, and imports existing submissions from `data/data.json`.
