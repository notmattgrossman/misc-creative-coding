# Interactive Profile Showcase

A dynamic, interactive profile showcase built with p5.js featuring animated background particles, a clickable profile image, and modern visual effects.

## Features

### Visual Effects
- **Animated Background**: 18 colorful particles (circles, squares, triangles) floating across the screen
- **Vibrant Color Palette**: Hot pink, bright green, blue, orange, purple, yellow, and cyan particles
- **Interactive Profile Image**: Circular profile photo with smooth hover glow effect
- **Inverse Circle Effect**: A following circle that creates an inverted color effect wherever the mouse moves
- **Custom Typography**: Uses the Honk variable font for stylish text display

### Interactivity
- **Clickable Profile**: Click the profile image to open Instagram (@notmattgrossman)
- **Mouse Following**: Interactive circle follows mouse movement with smooth interpolation
- **Hover Effects**: Profile image glows when hovered over
- **Responsive Design**: Adapts to different screen sizes

## How to Run

1. Open `index.html` in a modern web browser
2. Move your mouse around to see the inverse circle effect
3. Hover over the profile image to see the glow effect
4. Click the profile image to visit the Instagram profile

## Technical Details

- **Framework**: p5.js for graphics and animation
- **Fonts**: Honk variable font (included in `/Honk/` directory)
- **Images**: Profile photo (`myphoto.png`)
- **Styling**: Custom CSS with modern design principles

## Files Structure

```
├── index.html              # Main HTML file
├── sketch.js               # p5.js interactive sketch code
├── style.css               # Custom styling
├── myphoto.png             # Profile image
├── Honk/                   # Font directory
│   ├── Honk-Regular-VariableFont_MORF,SHLN.ttf
│   ├── README.txt
│   └── OFL.txt
└── README.md               # This file
```

## Requirements

- Modern web browser with JavaScript enabled
- Internet connection (for loading p5.js from CDN)

## Customization

To customize for your own profile:
1. Replace `myphoto.png` with your own profile image
2. Update the Instagram URL in the `mousePressed()` function
3. Modify the `@notmattgrossman` text in the sketch
4. Adjust colors, particle count, or effects as desired 