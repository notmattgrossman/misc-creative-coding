import requests
from bs4 import BeautifulSoup
from newspaper import Article
import logging

# Set up logging to suppress verbose newspaper3k output
logging.getLogger('newspaper').setLevel(logging.WARNING)
logging.getLogger('urllib3').setLevel(logging.WARNING)

def extract_title_from_url(url):
    """
    Extract title from URL using newspaper3k with BeautifulSoup fallback.
    Returns tuple: (title, success)
    """
    if not url or not url.strip():
        return None, False
    
    url = url.strip()
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    # First try newspaper3k
    try:
        article = Article(url)
        article.download()
        article.parse()
        
        if article.title and article.title.strip():
            return article.title.strip(), True
    except Exception as e:
        print(f"Newspaper3k failed: {e}")
    
    # Fallback to BeautifulSoup
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Try different title selectors
        title_selectors = [
            'title',
            'meta[property="og:title"]',
            'meta[name="twitter:title"]',
            'h1'
        ]
        
        for selector in title_selectors:
            if selector == 'title':
                title_tag = soup.find('title')
                if title_tag and title_tag.get_text().strip():
                    return title_tag.get_text().strip(), True
            elif selector.startswith('meta'):
                meta_tag = soup.select_one(selector)
                if meta_tag and meta_tag.get('content', '').strip():
                    return meta_tag.get('content').strip(), True
            else:  # h1
                h1_tag = soup.find('h1')
                if h1_tag and h1_tag.get_text().strip():
                    return h1_tag.get_text().strip(), True
                    
    except Exception as e:
        print(f"BeautifulSoup fallback failed: {e}")
    
    return None, False

def guess_media_type_from_url(url):
    """
    Guess media type based on URL patterns.
    """
    if not url:
        return None
    
    url = url.lower()
    
    if 'twitter.com' in url or 'x.com' in url:
        return 'tweets'
    elif any(domain in url for domain in ['spotify.com', 'apple.com/podcasts', 'overcast.fm', 'pocketcasts.com']):
        return 'podcasts'
    elif any(domain in url for domain in ['goodreads.com', 'amazon.com/dp', 'books.google.com']):
        return 'books'
    elif any(domain in url for domain in ['medium.com', 'substack.com', 'blog.', '/blog/', 'article']):
        return 'articles'
    else:
        return 'websites' 