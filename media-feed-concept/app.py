from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from database import init_db, add_media_item, get_all_media, delete_media_item
from url_scraper import extract_title_from_url, guess_media_type_from_url
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key-change-this')

# Media types
MEDIA_TYPES = ['books', 'podcasts', 'articles', 'websites', 'tweets']

@app.route('/')
def index():
    """Main page showing the feed."""
    return redirect(url_for('feed'))

@app.route('/feed')
def feed():
    """Display all media items in the feed."""
    media_items = get_all_media()
    return render_template('feed.html', media_items=media_items)

@app.route('/add', methods=['GET', 'POST'])
def add_media():
    """Add new media item."""
    if request.method == 'POST':
        # Get form data
        url = request.form.get('url', '').strip()
        title = request.form.get('title', '').strip()
        authors = request.form.get('authors', '').strip()
        media_type = request.form.get('media_type')
        rating = request.form.get('rating')
        thoughts = request.form.get('thoughts', '').strip()
        
        # Validation
        if not title:
            flash('Title is required!', 'error')
            return render_template('add.html', media_types=MEDIA_TYPES, 
                                 url=url, authors=authors, media_type=media_type, 
                                 rating=rating, thoughts=thoughts)
        
        if not media_type or media_type not in MEDIA_TYPES:
            flash('Please select a valid media type!', 'error')
            return render_template('add.html', media_types=MEDIA_TYPES, 
                                 url=url, title=title, authors=authors, 
                                 rating=rating, thoughts=thoughts)
        
        try:
            rating = int(rating)
            if rating < 1 or rating > 10:
                raise ValueError()
        except (ValueError, TypeError):
            flash('Rating must be a number between 1 and 10!', 'error')
            return render_template('add.html', media_types=MEDIA_TYPES, 
                                 url=url, title=title, authors=authors, 
                                 media_type=media_type, thoughts=thoughts)
        
        # Add to database
        try:
            add_media_item(title, authors, media_type, rating, thoughts, url)
            flash('Media item added successfully!', 'success')
            return redirect(url_for('feed'))
        except Exception as e:
            flash(f'Error adding media item: {str(e)}', 'error')
    
    return render_template('add.html', media_types=MEDIA_TYPES)

@app.route('/extract_title', methods=['POST'])
def extract_title():
    """AJAX endpoint to extract title from URL."""
    data = request.get_json()
    url = data.get('url', '').strip()
    
    if not url:
        return jsonify({'success': False, 'error': 'No URL provided'})
    
    title, success = extract_title_from_url(url)
    media_type = guess_media_type_from_url(url)
    
    return jsonify({
        'success': success,
        'title': title,
        'media_type': media_type,
        'message': 'Title extracted successfully!' if success else 'Could not extract title automatically'
    })

@app.route('/delete/<int:item_id>', methods=['POST'])
def delete_item(item_id):
    """Delete a media item."""
    if delete_media_item(item_id):
        flash('Item deleted successfully!', 'success')
    else:
        flash('Item not found!', 'error')
    return redirect(url_for('feed'))

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000) 