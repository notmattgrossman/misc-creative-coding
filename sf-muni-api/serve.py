#!/usr/bin/env python3
"""
Simple HTTP server for local development of the SF Muni app.
Run this if you encounter CORS issues when opening index.html directly.
"""

import http.server
import socketserver
import webbrowser
import os

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)

def main():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🚊 SF Muni App Server")
        print(f"📍 Serving at: http://localhost:{PORT}")
        print(f"🌐 Opening browser...")
        print(f"⚠️  Press Ctrl+C to stop the server")
        
        # Open browser automatically
        webbrowser.open(f'http://localhost:{PORT}')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n🛑 Server stopped.")

if __name__ == "__main__":
    main() 