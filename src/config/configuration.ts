export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3002,
  database: {
    uri: process.env.MONGODB_URI,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  auth: {
    serviceUrl: process.env.AUTH_SERVICE_URL,
  },
}); 