# ASCII Art Image Converter

A modern, responsive web application that converts images into ASCII art with customizable options and export functionality.

## Features

### ✨ Core Functionality
- **Image Upload**: Drag & drop or click to upload images
- **Live Preview**: See your uploaded image before conversion
- **ASCII Conversion**: Convert images to ASCII art with pixel-perfect accuracy
- **Real-time Controls**: Adjust settings and regenerate instantly

### 🎨 Customization Options
- **Character Sets**:
  - All printable characters (full detail)
  - Symbols only (!@#$%^&*...)
  - Minimal dots (*:. clean look)
- **Density Control**: Adjust resolution from 20-200 characters wide
- **Color Options**:
  - Monochrome ASCII (classic)
  - Full color mapping (preserves original colors)
  - Color tinting with custom color picker

### 📤 Export Features
- **Copy to Clipboard**: One-click copying for easy sharing
- **Download as .txt**: Save ASCII art as a text file
- **Cross-platform**: Works on desktop and mobile devices

## Usage

1. **Upload an Image**
   - Drag and drop an image file onto the upload area
   - Or click the upload area to browse and select a file
   - Supported formats: JPG, PNG, GIF, WebP, and other web-compatible images

2. **Customize Your ASCII Art**
   - Choose a character set that fits your style
   - Adjust the density slider for resolution (higher = more detail)
   - Select a color tint or enable full color mapping
   - Toggle between monochrome and colored output

3. **Generate and Export**
   - Click "Generate ASCII Art" to convert your image
   - Use "Copy to Clipboard" to share your creation
   - Use "Download .txt" to save the ASCII art as a file

## Technical Details

### Built With
- **HTML5**: Semantic structure and canvas API
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **Vanilla JavaScript**: No dependencies, pure ES6+ code

### Browser Compatibility
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance
- Client-side processing (no server required)
- Efficient canvas-based pixel sampling
- Optimized for images up to 2000x2000 pixels
- Responsive font sizing for different screen sizes

## Deployment

### Netlify Deployment (Recommended)
1. Upload all files (`index.html`, `style.css`, `script.js`) to a folder
2. Drag the folder to your Netlify dashboard
3. Your app will be live instantly with a generated URL

### Alternative Hosting
Works on any static hosting service:
- GitHub Pages
- Vercel
- Firebase Hosting
- Any web server that serves static files

### Local Development
Simply open `index.html` in your browser - no build process required!

## File Structure
```
ascii-art-converter/
├── index.html          # Main HTML structure
├── style.css          # Styling and responsive design
├── script.js          # ASCII conversion logic
└── README.md          # This file
```

## Features in Detail

### Character Set Options
- **Full Set**: Uses the complete range of printable ASCII characters for maximum detail
- **Symbols**: Limited to punctuation and symbols for a distinct artistic style
- **Dots**: Minimal character set perfect for subtle, clean ASCII art

### Color Mapping
- **Monochrome**: Classic black ASCII on dark background
- **Color Tint**: Applies a single color tint to the entire ASCII output
- **Full Color**: Each character retains the color from the original image pixel

### Responsive Design
- Adapts to different screen sizes automatically
- Touch-friendly on mobile devices
- Optimized font sizes for readability across devices

## Browser APIs Used
- **FileReader API**: For reading uploaded image files
- **Canvas API**: For pixel-level image processing
- **Clipboard API**: For copy-to-clipboard functionality
- **Blob API**: For generating downloadable text files

---

**Ready to transform your images into amazing ASCII art? Just open `index.html` and start creating!** 