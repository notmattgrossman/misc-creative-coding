import sqlite3
from datetime import datetime
import os

DATABASE = 'media_feed.db'

def init_db():
    """Initialize the database with the media table."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS media (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            authors TEXT,
            media_type TEXT NOT NULL,
            rating INTEGER CHECK(rating >= 1 AND rating <= 10),
            thoughts TEXT,
            url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

def add_media_item(title, authors, media_type, rating, thoughts, url=None):
    """Add a new media item to the database."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO media (title, authors, media_type, rating, thoughts, url)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (title, authors, media_type, rating, thoughts, url))
    
    conn.commit()
    conn.close()
    return cursor.lastrowid

def get_all_media():
    """Retrieve all media items ordered by creation date (newest first)."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, title, authors, media_type, rating, thoughts, url, created_at
        FROM media 
        ORDER BY created_at DESC
    ''')
    
    items = cursor.fetchall()
    conn.close()
    
    # Convert to list of dictionaries for easier template handling
    media_items = []
    for item in items:
        media_items.append({
            'id': item[0],
            'title': item[1],
            'authors': item[2],
            'media_type': item[3],
            'rating': item[4],
            'thoughts': item[5],
            'url': item[6],
            'created_at': item[7]
        })
    
    return media_items

def delete_media_item(item_id):
    """Delete a media item by ID."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM media WHERE id = ?', (item_id,))
    conn.commit()
    conn.close()
    return cursor.rowcount > 0 