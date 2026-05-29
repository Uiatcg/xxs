require('dotenv').config();
const mineflayer = require('mineflayer');

// Configuration from environment variables or defaults
const config = {
  host: process.env.SERVER_IP || '15.235.144.96',
  port: parseInt(process.env.SERVER_PORT || '12802'),
  botPrefix: process.env.BOT_PREFIX || 'Bot',
};

// Generate random username
function generateRandomUsername() {
  const prefixes = [config.botPrefix, 'AFK', 'Idle', 'Player'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomNum = Math.floor(Math.random() * 1000);
  return `${prefix}${randomNum}`;
}

// Main bot class
class MinecraftAFKBot {
  constructor() {
    this.bot = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = Infinity;
    this.reconnectDelay = 10000; // 10 seconds
  }

  // Create bot instance
  createBot() {
    const username = generateRandomUsername();
    
    console.log(`[${new Date().toISOString()}] Creating bot with username: ${username}`);
    console.log(`[${new Date().toISOString()}] Connecting to ${config.host}:${config.port}`);

    this.bot = mineflayer.createBot({
      host: config.host,
      port: config.port,
      username: username,
      version: false, // Auto-detect version
    });

    this.setupBotListeners();
  }

  // Setup bot event listeners
  setupBotListeners() {
    // Bot spawned
    this.bot.on('spawn', () => {
      console.log(`[${new Date().toISOString()}] ✓ Bot spawned successfully!`);
      console.log(`[${new Date().toISOString()}] Username: ${this.bot.username}`);
      this.reconnectAttempts = 0; // Reset reconnect counter on successful connection
      this.startAFKActivity();
    });

    // Bot login
    this.bot.on('login', () => {
      console.log(`[${new Date().toISOString()}] ✓ Bot logged in`);
    });

    // Chat messages
    this.bot.on('message', (jsonMsg) => {
      const message = jsonMsg.toString();
      console.log(`[${new Date().toISOString()}] [Chat] ${message}`);
    });

    // Player joined
    this.bot.on('playerJoined', (player) => {
      console.log(`[${new Date().toISOString()}] Player joined: ${player.username}`);
    });

    // Player left
    this.bot.on('playerLeft', (player) => {
      console.log(`[${new Date().toISOString()}] Player left: ${player.username}`);
    });

    // Kicked from server
    this.bot.on('kicked', (reason) => {
      console.error(`[${new Date().toISOString()}] ✗ Kicked from server: ${reason}`);
      this.scheduleReconnect();
    });

    // Connection error
    this.bot.on('error', (err) => {
      console.error(`[${new Date().toISOString()}] ✗ Bot error: ${err.message}`);
    });

    // End connection
    this.bot.on('end', () => {
      console.warn(`[${new Date().toISOString()}] ✗ Connection ended`);
      this.scheduleReconnect();
    });

    // Health update
    this.bot.on('health', () => {
      console.log(`[${new Date().toISOString()}] Health: ${this.bot.health}, Food: ${this.bot.food}`);
    });

    // Time update
    this.bot.on('time', () => {
      // Silent - happens frequently
    });

    // Death
    this.bot.on('death', () => {
      console.warn(`[${new Date().toISOString()}] ⚠ Bot died, respawning...`);
    });
  }

  // Start AFK activity to prevent kick
  startAFKActivity() {
    setInterval(() => {
      if (!this.bot || !this.bot.entity) return;

      // Random activity (1-4)
      const activity = Math.floor(Math.random() * 4) + 1;

      try {
        switch (activity) {
          case 1:
            // Random jump
            this.bot.setControlState('jump', true);
            setTimeout(() => this.bot.setControlState('jump', false), 100);
            console.log(`[${new Date().toISOString()}] Activity: Jumped`);
            break;

          case 2:
            // Random rotation
            const yaw = Math.random() * Math.PI * 2;
            const pitch = (Math.random() - 0.5) * Math.PI;
            this.bot.look(yaw, pitch);
            console.log(`[${new Date().toISOString()}] Activity: Rotated`);
            break;

          case 3:
            // Random walk
            const direction = Math.floor(Math.random() * 4);
            const walkDuration = Math.random() * 2000 + 1000; // 1-3 seconds

            const walkState = [
              'forward',
              'back',
              'left',
              'right'
            ][direction];

            this.bot.setControlState(walkState, true);
            setTimeout(() => this.bot.setControlState(walkState, false), walkDuration);
            console.log(`[${new Date().toISOString()}] Activity: Walking ${walkState}`);
            break;

          case 4:
            // Sprint
            this.bot.setControlState('sprint', true);
            setTimeout(() => this.bot.setControlState('sprint', false), 500);
            console.log(`[${new Date().toISOString()}] Activity: Sprinted`);
            break;
        }
      } catch (err) {
        console.error(`[${new Date().toISOString()}] Error during AFK activity: ${err.message}`);
      }
    }, 15000); // Activity every 15 seconds
  }

  // Schedule reconnection
  scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay;

    console.log(`[${new Date().toISOString()}] Reconnecting in ${delay / 1000} seconds (Attempt ${this.reconnectAttempts})...`);

    setTimeout(() => {
      this.createBot();
    }, delay);
  }

  // Start the bot
  start() {
    console.log('='.repeat(60));
    console.log('Minecraft AFK Bot - Keeping server online 24/7');
    console.log('='.repeat(60));
    console.log(`Configuration:`);
    console.log(`  Server: ${config.host}:${config.port}`);
    console.log(`  Bot Prefix: ${config.botPrefix}`);
    console.log('='.repeat(60));

    this.createBot();
  }
}

// Initialize and start bot
const bot = new MinecraftAFKBot();
bot.start();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[SHUTDOWN] Shutting down bot gracefully...');
  if (bot.bot) {
    bot.bot.quit();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n[SHUTDOWN] Shutting down bot gracefully...');
  if (bot.bot) {
    bot.bot.quit();
  }
  process.exit(0);
});
