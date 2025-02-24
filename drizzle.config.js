require('dotenv').config({ path: '.env' });

module.exports = {
  schema: "./configs/schema.js",  
  out: "./migrations",        
  dialect: "postgresql",       
  dbCredentials: {
    url: 'postgresql://neondb_owner:Wc7eo1BNSiEI@ep-bitter-river-a15cq3ol.ap-southeast-1.aws.neon.tech/ai-short-video-generator?sslmode=require',  // Connection string from .env file
  },
};
