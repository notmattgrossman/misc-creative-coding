let circleX;
let circleY;
let circleSize = 100;
let myPhoto;
let shapes = [];
let honkFont;

function preload() {
    myPhoto = loadImage('/myphoto.png');
    honkFont = loadFont('Honk/Honk-Regular-VariableFont_MORF,SHLN.ttf');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    circleX = width / 2;
    circleY = height / 2;
    
    // Create vibrant color palette
    let colors = [
        color(255, 100, 150, random(80, 150)),
        color(100, 255, 150, random(80, 150)),
        color(100, 150, 255, random(80, 150)),
        color(255, 200, 100, random(80, 150)),
        color(200, 100, 255, random(80, 150)),
        color(255, 255, 100, random(80, 150)),
        color(100, 255, 255, random(80, 150))
    ];
    
    // Create animated background shapes
    for (let i = 0; i < 18; i++) {
        let shapeType = i < 8 ? i % 3 : 0;
        
        shapes.push({
            x: random(width),
            y: random(height),
            size: random(30, 120),
            speedX: random(-1.5, 1.5),
            speedY: random(-1.5, 1.5),
            color: colors[i % colors.length],
            rotation: 0,
            rotSpeed: random(-0.03, 0.03),
            type: shapeType
        });
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    let imgSize = 300;
    let imgX = (width - imgSize) / 2;
    let imgY = (height - imgSize) / 2;
    let centerX = imgX + imgSize/2;
    let centerY = imgY + imgSize/2;
    let radius = imgSize/2;
    
    if (dist(mouseX, mouseY, centerX, centerY) <= radius) {
        window.open('https://www.instagram.com/notmattgrossman/', '_blank');
    }
}

function draw() {
    background(20);
    
    // Image positioning variables (used multiple times)
    let imgSize = 300;
    let imgX = (width - imgSize) / 2;
    let imgY = (height - imgSize) / 2;
    let centerX = imgX + imgSize/2;
    let centerY = imgY + imgSize/2;
    let radius = imgSize/2;
    let distance = dist(mouseX, mouseY, centerX, centerY);
    let isHovering = distance <= radius;
    
    // Draw animated background shapes
    for (let shape of shapes) {
        push();
        translate(shape.x, shape.y);
        rotate(shape.rotation);
        fill(shape.color);
        noStroke();
        
        if (shape.type == 0) {
            ellipse(0, 0, shape.size);
        } else if (shape.type == 1) {
            rect(-shape.size/2, -shape.size/2, shape.size, shape.size);
        } else {
            triangle(0, -shape.size/2, -shape.size/2, shape.size/2, shape.size/2, shape.size/2);
        }
        pop();
        
        // Update shape position and rotation
        shape.x += shape.speedX;
        shape.y += shape.speedY;
        shape.rotation += shape.rotSpeed;
        
        // Wrap around screen
        if (shape.x < -shape.size) shape.x = width + shape.size;
        if (shape.x > width + shape.size) shape.x = -shape.size;
        if (shape.y < -shape.size) shape.y = height + shape.size;
        if (shape.y > height + shape.size) shape.y = -shape.size;
    }
    
    // Create circular mask and draw image
    push();
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.arc(centerX, centerY, radius, 0, TWO_PI);
    drawingContext.clip();
    image(myPhoto, imgX, imgY, imgSize, imgSize);
    drawingContext.restore();
    pop();
    
    // Add hover effect
    if (isHovering) {
        cursor(HAND);
        noFill();
        for (let i = 0; i < 10; i++) {
            let glowAlpha = map(i, 0, 9, 60, 5);
            let glowSize = imgSize + (i * 8);
            stroke(255, 255, 255, glowAlpha);
            strokeWeight(2);
            ellipse(centerX, centerY, glowSize);
        }
    } else {
        cursor(ARROW);
    }
    
    // Draw text
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(64);
    textFont(honkFont);
    text('@notmattgrossman', width / 2, imgY + imgSize + 50);
    
    // Inverse circle effect
    push();
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.arc(circleX, circleY, circleSize/2, 0, TWO_PI);
    drawingContext.clip();
    blendMode(DIFFERENCE);
    fill(255);
    rect(0, 0, width, height);
    drawingContext.restore();
    pop();
    
    // Move circle with mouse
    circleX = lerp(circleX, mouseX, 0.1);
    circleY = lerp(circleY, mouseY, 0.1);
} 