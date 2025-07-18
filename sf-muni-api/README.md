# SF Muni - Chinatown Station Real-time Arrivals

A beautiful, modern web app that displays real-time arrival predictions for the SF Muni T-Third Street line at the Chinatown-Rose Pak Station.

## Features

- 🚊 **Real-time arrivals** - Live data from SF Muni's NextBus system
- 🔄 **Auto-refresh** - Updates every 30 seconds automatically  
- 📱 **Responsive design** - Works great on desktop and mobile
- 🎨 **Modern UI** - Beautiful, transit-inspired design
- ⚡ **Fast loading** - Optimized for quick data fetching
- 🔄 **Smart refresh** - Pauses when tab is not active to save bandwidth

## Station Information

- **Station**: Chinatown - Rose Pak Station
- **Stop ID**: 17876
- **Route**: T-Third Street 
- **Location**: Chinatown, San Francisco
- **Coordinates**: 37.7948, -122.4081

## How to Use

### Option 1: Direct File Opening (Recommended)
1. **Open the app** - Simply open `index.html` in any modern web browser
2. **View arrivals** - Real-time predictions will load automatically
3. **Refresh manually** - Click the refresh button for instant updates
4. **Auto-updates** - The app refreshes every 30 seconds when active

### Option 2: Local Server (If you encounter CORS issues)
1. **Run the server** - Execute `python3 serve.py` in the terminal
2. **Browser opens automatically** - App will open at `http://localhost:8000`
3. **Stop server** - Press `Ctrl+C` in the terminal when done

```bash
# Start local server
python3 serve.py

# Or manually with Python's built-in server
python3 -m http.server 8000
```

## Technical Details

- **Data Source**: SF Muni NextBus XML API
- **API Endpoint**: `https://retro.umoiq.com/service/publicXMLFeed`
- **CORS Handling**: Uses AllOrigins proxy for cross-origin requests
- **Update Frequency**: 30 seconds (when tab is active)
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)

## Files

- `index.html` - Main application page
- `styles.css` - Beautiful, responsive styling
- `script.js` - Real-time data fetching and UI logic
- `serve.py` - Optional local development server
- `README.md` - This documentation

## About the T-Third Street Line

The T-Third Street line connects downtown San Francisco to the southeastern neighborhoods, running from Chinatown through SOMA, Mission Bay, and continuing to Sunnydale. The Chinatown-Rose Pak Station serves as an important transit hub in the heart of San Francisco's historic Chinatown district.

## Troubleshooting

### No Data Loading?
- Check your internet connection
- Try refreshing the page or clicking the refresh button
- If using Safari, you may need to use the local server option
- Some corporate networks may block the external API

### CORS Errors?
- Use the local server: `python3 serve.py`
- Try a different browser
- Check browser console for detailed error messages

## Data Disclaimer

Transit predictions are estimates based on real-time vehicle locations and may vary due to traffic conditions, mechanical issues, or other service disruptions. Always allow extra time for important trips.

---

*Data provided by San Francisco Municipal Transportation Agency (SFMTA)* 