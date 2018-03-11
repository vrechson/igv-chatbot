module.exports = {
  TELEGRAM_API_TOKEN: process.env.TELEGRAM_API_TOKEN || null,
  MONGO_DB_URI: process.env.MONGO_DB_URI || 'mongodb://localhost:27017',
  EXPA_API_URL: process.env.EXPA_API_URL,
  EXPA_API_TOKEN: process.env.EXPA_API_TOKEN,
  EXPA_API_RECURENCE: process.env.EXPA_API_RECURENCE || 1000 * 60 * 2
}
