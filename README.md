# Minecraft AFK Bot 🤖

A lightweight Node.js bot that keeps your Minecraft Java server active 24/7 by automatically joining and performing AFK activities to prevent auto-sleep on free hosting services.

## Features ✨

- **Auto-join**: Automatically connects to your Minecraft server
- **Auto-reconnect**: Reconnects every 10 seconds if disconnected
- **AFK Prevention**: Performs random activities to prevent being kicked
  - Random jumping
  - Random looking around (rotation)
  - Random walking movements
  - Sprint movements
- **Random Usernames**: Generates unique bot names on each restart
- **Lightweight**: Minimal RAM and CPU usage, perfect for free hosting
- **Environment Variables**: Easily configure without code changes
- **Railway Ready**: One-click deployment to Railway
- **24/7 Uptime**: Keeps server online indefinitely

## Requirements

- Node.js 16.0 or higher
- Minecraft Java Server (any version)
- Network access to your server

## Installation

### Local Setup

```bash
# Clone or download this repository
git clone https://github.com/Uiatcg/xxs.git
cd xxs

# Install dependencies
npm install

# Start the bot
npm start
```

### Railway Deployment

1. **Push to GitHub**: Ensure this repo is on GitHub
2. **Connect to Railway**:
   - Go to [Railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select this repository
3. **Add Environment Variables** (optional):
   - Go to "Variables" in Railway dashboard
   - Add custom values for `SERVER_IP`, `SERVER_PORT`, `BOT_PREFIX`
4. **Deploy**: Railway will automatically:
   - Install dependencies via `npm install`
   - Start the bot with `npm start`
   - Keep it running 24/7

## Configuration

### Environment Variables

Create a `.env` file in the root directory or set them in your hosting platform:

```env
SERVER_IP=15.235.144.96
SERVER_PORT=12802
BOT_PREFIX=Bot
```

### Available Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SERVER_IP` | `15.235.144.96` | Your Minecraft server IP address |
| `SERVER_PORT` | `12802` | Your Minecraft server port |
| `BOT_PREFIX` | `Bot` | Prefix for random bot usernames |

### Example Configurations

**Change Server:**
```env
SERVER_IP=play.example.com
SERVER_PORT=25565
```

**Custom Bot Prefix:**
```env
BOT_PREFIX=AFK
# This will generate usernames like: AFK123, AFK456, etc.
```

**Multiple Bots:**
Deploy multiple Railway projects with different prefixes to run multiple bots simultaneously.

## How It Works

1. **Connection**: Bot connects to the server with a random username
2. **Spawn**: Waits for bot to spawn into the world
3. **AFK Activity Loop** (every 15 seconds):
   - Randomly performs one of four activities:
     - Jump
     - Look around
     - Walk in random direction
     - Sprint
4. **Reconnection**: If disconnected, automatically reconnects after 10 seconds
5. **Logging**: All events are logged to console with timestamps

## Project Structure

```
xxs/
├── index.js          # Main bot implementation
├── package.json      # Dependencies and scripts
├── .env              # Environment variables (create manually)
├── .gitignore        # Git ignore file
└── README.md         # This file
```

## Logs & Monitoring

The bot logs all activities with timestamps:

```
[2026-05-29T10:30:45.123Z] Creating bot with username: Bot567
[2026-05-29T10:30:46.456Z] Connecting to 15.235.144.96:12802
[2026-05-29T10:30:48.789Z] ✓ Bot spawned successfully!
[2026-05-29T10:30:48.890Z] Activity: Jumped
[2026-05-29T10:30:50.234Z] Activity: Rotated
```

## Troubleshooting

### Bot won't connect
- Verify server IP and port are correct
- Check if server is online
- Ensure your hosting can reach the server IP

### Bot gets kicked immediately
- Server might have authentication enabled
- Check if server requires premium authentication
- Verify bot username isn't banned

### High RAM usage
- Restart the bot
- Reduce activity frequency by modifying `startAFKActivity()` interval

### No logs appearing
- Check if server is reachable: `ping 15.235.144.96`
- Verify port is accessible: `telnet 15.235.144.96 12802`

## Advanced Configuration

### Modify Activity Frequency

In `index.js`, change the interval in `startAFKActivity()`:

```javascript
// Current: 15 seconds
}, 15000);

// Make more frequent: 10 seconds
}, 10000);

// Make less frequent: 30 seconds
}, 30000);
```

### Add Custom Activities

Edit the `switch` statement in `startAFKActivity()` to add more bot behaviors.

### Change Reconnect Delay

In the `MinecraftAFKBot` class:

```javascript
this.reconnectDelay = 10000; // Change to desired milliseconds
```

## Performance

- **RAM**: ~80-120 MB
- **CPU**: ~5-15% (minimal)
- **Network**: ~0.5-2 Mbps
- **Ideal for**: Free tier hosting on Railway, Heroku, etc.

## Limitations

- Single bot per instance (run multiple Railway projects for multiple bots)
- Won't place/break blocks or interact with world
- Won't respond to commands or chat
- Pure AFK activity only

## Use Cases

✅ Keep server online during off-peak hours
✅ Prevent free hosting auto-sleep
✅ Maintain active player count
✅ Test server stability
✅ Keep chunks loaded for other plugins

❌ Cannot replace actual players
❌ Not suitable for large-scale operations

## Support & Issues

For issues or questions:
1. Check server logs: `npm start` output
2. Verify environment variables
3. Ensure server is accessible and online
4. Check Railway deployment logs

## License

MIT - Feel free to use and modify

## Credits

Built with [mineflayer](https://github.com/PrismarineJS/mineflayer) - The JavaScript Minecraft client library.

---

**Deploy to Railway**: [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app?referralCode=YOUR_CODE)

Made with ❤️ for Minecraft server admins
