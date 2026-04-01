module.exports = {
  apps : [{
    name: "shikkhapath-news",
    script: "npm",
    args: "start",
    env: {
      PORT: 3000,
      NODE_ENV: "production",
    }
  }]
}

//pm2 start ecosystem.config.js