# MediaFeed

A simple and elegant web app to track and review all the media you consume - books, podcasts, articles, websites, and tweets.

## Features

- 📚 Track 5 types of media: Books, Podcasts, Articles, Websites, Tweets
- ⭐ Rate media out of 10 (like the Beli app)
- 📝 Write personal reviews and thoughts
- 🔗 Automatic title extraction from URLs
- 📱 Modern, responsive design
- 🗂️ Clean feed view of all your reviews

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application:**
   ```bash
   python app.py
   ```

3. **Open your browser and go to:**
   ```
   http://localhost:5000
   ```

## How to Use

### Adding Media
1. Click "Add Media" in the navigation
2. **Option 1 - With URL:** Paste a URL and click "Extract Title" to automatically pull the title and guess media type
3. **Option 2 - Manual:** Enter all details manually
4. Fill in:
   - Title (required)
   - Author(s) (optional)
   - Media type (required)
   - Rating 1-10 (required) - click the stars to rate
   - Your thoughts and review (optional)

### Viewing Your Feed
- Click "Feed" to see all your media reviews
- Items are sorted by newest first
- Each card shows the rating, title, author, your thoughts, and date added
- Click external link icon to visit the original URL
- Delete items using the trash icon

## Technical Details

- **Backend:** Flask (Python)
- **Database:** SQLite
- **Frontend:** Bootstrap 5 + vanilla JavaScript
- **URL Scraping:** newspaper3k with BeautifulSoup fallback
- **Styling:** Modern CSS with hover effects and gradients

## File Structure

```
MediaFeed/
├── app.py              # Main Flask application
├── database.py         # SQLite database operations
├── url_scraper.py      # URL title extraction logic
├── requirements.txt    # Python dependencies
├── media_feed.db      # SQLite database (created automatically)
├── templates/
│   ├── base.html      # Base template with navigation
│   ├── feed.html      # Media feed display
│   └── add.html       # Add new media form
└── README.md          # This file
```

## Features in Detail

### URL Title Extraction
- First tries newspaper3k for article parsing
- Falls back to BeautifulSoup with multiple title selectors
- Automatically guesses media type based on URL patterns
- Handles various edge cases and errors gracefully

### Rating System
- Interactive star rating (1-10 scale)
- Visual feedback on hover
- Styled like the Beli app rating system

### Media Type Detection
- Twitter/X links → Tweets
- Spotify/Apple Podcasts → Podcasts  
- Goodreads/Amazon books → Books
- Medium/Substack → Articles
- Everything else → Websites

Enjoy tracking your media consumption! 📖🎧📰 