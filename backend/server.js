const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

// Initialize background cron jobs
const { initJobFetcher, fetchJobsFromAPI } = require('./services/jobFetcher.service');
initJobFetcher();

// Run it once immediately on startup so the DB gets populated with real jobs
fetchJobsFromAPI();

server.listen(port, ()=>{
    console.log(`server is running on port http://localhost:${port}`);
})