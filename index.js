require('dotenv').config();
const mineflayer = require('mineflayer');

// Configuration
const config = {
  host: process.env.SERVER_IP || '15.235.144.96',
  port: parseInt(process.env.SERVER_PORT || '12802'),
  botPrefix: process.env.BOT_PREFIX || 'Player',
};

// Realistic player names
const PLAYER_NAMES = [
  'Alex_Gaming', 'Steve_Pro', 'Luna_Sky', 'Phoenix_Fire', 'Shadow_Wolf',
  'Crystal_Dream', 'Thunder_Storm', 'Ocean_Wave', 'Forest_Sage', 'Ember_Light',
  'Sage_Mind', 'Wild_Heart', 'Silver_Moon', 'Golden_Sun', 'Azure_Sky',
  'Cosmic_Star', 'Pixel_Master', 'Quest_Hero', 'Mystic_Soul', 'Brave_Knight',
  'Swift_Arrow', 'Wise_Owl', 'Mighty_Oak', 'Gentle_Breeze', 'Silent_Shadow'
];

// Chat messages (100 messages)
const CHAT_MESSAGES = [
  'ggs yo', 'nice play', 'wp everyone', 'good game', 'that was fun',
  'let\'s play again', 'amazing', 'awesome', 'cool', 'epic',
  'sick', 'fire', 'lit', 'no cap', 'facts',
  'for real', 'bestie', 'my bad', 'oops', 'haha',
  'lol', 'rofl', 'xd', 'bruh', 'nah',
  'yea', 'nope', 'sure', 'okay', 'alright',
  'let\'s go', 'come on', 'yeah', 'what\'s up', 'yo',
  'sup', 'hey guys', 'hello everyone', 'hi there', 'greetings',
  'anyone home', 'anyone here', 'where is everyone', 'hello', 'anybody around',
  'mining time', 'going mining', 'exploring', 'building', 'creating',
  'making a base', 'look at my house', 'check this out', 'see this', 'look',
  'anyone want to team up', 'wanna team', 'wanna group', 'let\'s team', 'group up',
  'need help', 'help me', 'can someone help', 'anyone got diamonds', 'found diamonds',
  'exploring caves', 'cave run', 'nether time', 'going to nether', 'dimension run',
  'farming time', 'need wood', 'chopping trees', 'building farm', 'crop time',
  'sleep time', 'night time', 'zzz', 'tired', 'taking a break',
  'back from afk', 'just logged in', 'hey everyone', 'im here', 'online now',
  'this server is cool', 'nice server', 'fun server', 'love this server', 'best server',
  'anyone building', 'wanna build together', 'lets build', 'building with me', 'creative time',
  'monster hunting', 'going to find mobs', 'collecting drops', 'farm mobs', 'grinding',
  'fishing', 'going fishing', 'hooked one', 'good catch', 'fishing time'
];

// Bot manager class for multiple bots
class MultiPlayerBotManager {
  constructor() {
    this.bots = [];
    this.activeBotCount = 0;
    this.maxConcurrentBots = 2;
    this.botRotationInterval = null;
  }

  // Generate unique player name
  generatePlayerName() {
    return PLAYER_NAMES[Math.floor(Math.random() * PLAYER_NAMES.length)] + 
           '_' + Math.floor(Math.random() * 10000);
  }

  // Create a single bot instance
  createBot() {
    const username = this.generatePlayerName();
    
    console.log(`[${new Date().toISOString()}] 🤖 Creating bot: ${username}`);

    const bot = mineflayer.createBot({
      host: config.host,
      port: config.port,
      username: username,
      version: false,
    });

    this.setupBotListeners(bot);
    this.bots.push(bot);
    this.activeBotCount++;

    return bot;
  }

  // Setup bot event listeners
  setupBotListeners(bot) {
    bot.on('spawn', () => {
      console.log(`[${new Date().toISOString()}] ✓ ${bot.username} spawned successfully!`);
      this.startRealisticMovement(bot);
      this.startRandomChat(bot);
    });

    bot.on('login', () => {
      console.log(`[${new Date().toISOString()}] ✓ ${bot.username} logged in`);
    });

    bot.on('message', (jsonMsg) => {
      const message = jsonMsg.toString();
      console.log(`[${new Date().toISOString()}] [${bot.username}] 💬 ${message}`);
    });

    bot.on('playerJoined', (player) => {
      console.log(`[${new Date().toISOString()}] 👤 ${player.username} joined`);
    });

    bot.on('playerLeft', (player) => {
      console.log(`[${new Date().toISOString()}] 👤 ${player.username} left`);
    });

    bot.on('kicked', (reason) => {
      console.error(`[${new Date().toISOString()}] ⚠️ ${bot.username} kicked: ${reason}`);
      this.handleBotDisconnect(bot);
    });

    bot.on('error', (err) => {
      console.error(`[${new Date().toISOString()}] ❌ ${bot.username} error: ${err.message}`);
    });

    bot.on('end', () => {
      console.warn(`[${new Date().toISOString()}] ❌ ${bot.username} disconnected`);
      this.handleBotDisconnect(bot);
    });

    bot.on('death', () => {
      console.warn(`[${new Date().toISOString()}] ☠️ ${bot.username} died`);
    });
  }

  // Realistic continuous movement (10 steps forward, 10 steps backward every 10 seconds)
  startRealisticMovement(bot) {
    setInterval(() => {
      if (!bot || !bot.entity) return;

      try {
        // Random looking around to seem real
        if (Math.random() > 0.7) {
          const yaw = Math.random() * Math.PI * 2;
          const pitch = (Math.random() - 0.5) * Math.PI;
          bot.look(yaw, pitch);
        }

        // Move forward for 10 steps
        bot.setControlState('forward', true);
        setTimeout(() => {
          bot.setControlState('forward', false);
          
          // Wait a moment then move backward for 10 steps
          setTimeout(() => {
            bot.setControlState('back', true);
            setTimeout(() => {
              bot.setControlState('back', false);
            }, 1500); // 10 steps backward (~1.5 seconds)
          }, 500);
        }, 1500); // 10 steps forward (~1.5 seconds)

      } catch (err) {
        // Silently handle errors
      }
    }, 10000); // Every 10 seconds
  }

  // Random chat messages
  startRandomChat(bot) {
    setInterval(() => {
      if (!bot) return;

      try {
        // Occasionally send chat messages (30% chance every 30-60 seconds)
        if (Math.random() > 0.7) {
          const message = CHAT_MESSAGES[Math.floor(Math.random() * CHAT_MESSAGES.length)];
          bot.chat(message);
          console.log(`[${new Date().toISOString()}] 💬 ${bot.username} said: ${message}`);
        }
      } catch (err) {
        // Silently handle errors
      }
    }, 30000 + Math.random() * 30000); // Random 30-60 seconds
  }

  // Handle bot disconnection
  handleBotDisconnect(bot) {
    this.bots = this.bots.filter(b => b !== bot);
    this.activeBotCount--;
    console.log(`[${new Date().toISOString()}] 📊 Active bots: ${this.activeBotCount}/${this.maxConcurrentBots}`);
  }

  // Bot rotation system: every 30-120 minutes, new bot joins, old one leaves
  startBotRotation() {
    this.botRotationInterval = setInterval(() => {
      const rotationMinutes = 30 + Math.random() * 90; // 30-120 minutes
      const rotationMs = rotationMinutes * 60 * 1000;

      console.log(`[${new Date().toISOString()}] 🔄 Bot rotation in ${Math.round(rotationMinutes)} minutes`);

      setTimeout(() => {
        if (this.bots.length > 0) {
          // Remove oldest bot
          const oldBot = this.bots.shift();
          console.log(`[${new Date().toISOString()}] 👋 ${oldBot.username} leaving (rotation)`);
          
          try {
            oldBot.quit();
          } catch (err) {
            // Ignore errors
          }
          this.activeBotCount--;
        }

        // Add new bot
        console.log(`[${new Date().toISOString()}] ✅ New bot joining (rotation)`);
        this.createBot();

      }, rotationMs);

    }, 60 * 60 * 1000); // Check every hour
  }

  // Start the manager
  start() {
    console.log('╔' + '═'.repeat(60) + '╗');
    console.log('║' + ' REALISTIC MINECRAFT PLAYER BOT SYSTEM'.padEnd(60) + '║');
    console.log('║' + ' Multiple players with realistic behavior'.padEnd(60) + '║');
    console.log('╚' + '═'.repeat(60) + '╝');
    console.log(`\n🎮 Server: ${config.host}:${config.port}`);
    console.log(`👥 Concurrent Players: ${this.maxConcurrentBots}`);
    console.log(`⏱️  Rotation: Every 30-120 minutes`);
    console.log(`💬 Chat: Random messages every 30-60 seconds\n`);

    // Create initial bots
    for (let i = 0; i < this.maxConcurrentBots; i++) {
      setTimeout(() => {
        this.createBot();
      }, i * 2000); // Stagger bot creation by 2 seconds
    }

    // Start rotation system
    this.startBotRotation();
  }
}

// Initialize and start the manager
const manager = new MultiPlayerBotManager();
manager.start();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[SHUTDOWN] Shutting down all bots gracefully...');
  manager.bots.forEach(bot => {
    try {
      bot.quit();
    } catch (err) {
      // Ignore
    }
  });
  if (manager.botRotationInterval) {
    clearInterval(manager.botRotationInterval);
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n[SHUTDOWN] Shutting down all bots gracefully...');
  manager.bots.forEach(bot => {
    try {
      bot.quit();
    } catch (err) {
      // Ignore
    }
  });
  if (manager.botRotationInterval) {
    clearInterval(manager.botRotationInterval);
  }
  process.exit(0);
});
