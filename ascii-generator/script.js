// ASCII Art Image Converter
class ASCIIConverter {
    constructor() {
        this.currentImage = null;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.asciiResult = '';
        
        // Character sets for different options
        this.characterSets = {
            full: ' .\'`^",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
            symbols: ' !@#$%^&*()_-+=:;"\'?/><.,|}{[]~`',
            dots: ' .*:°•◦∘○●'
        };
        
        this.initializeElements();
        this.setupEventListeners();
    }
    
    initializeElements() {
        // Upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.imagePreview = document.getElementById('imagePreview');
        this.previewImg = document.getElementById('previewImg');
        this.removeBtn = document.getElementById('removeImage');
        
        // Control elements
        this.charSetSelect = document.getElementById('charSetSelect');
        this.densitySlider = document.getElementById('densitySlider');
        this.densityValue = document.getElementById('densityValue');
        this.colorPicker = document.getElementById('colorPicker');
        this.colorToggle = document.getElementById('colorToggle');
        this.generateBtn = document.getElementById('generateBtn');
        
        // Output elements
        this.asciiOutput = document.getElementById('asciiOutput');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        // Initially disable export buttons
        this.copyBtn.disabled = true;
        this.downloadBtn.disabled = true;
        this.generateBtn.disabled = true;
    }
    
    setupEventListeners() {
        // Upload area events
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        
        // File input change
        this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        
        // Remove image
        this.removeBtn.addEventListener('click', this.removeImage.bind(this));
        
        // Controls
        this.densitySlider.addEventListener('input', this.updateDensityValue.bind(this));
        this.generateBtn.addEventListener('click', this.generateASCII.bind(this));
        
        // Export buttons
        this.copyBtn.addEventListener('click', this.copyToClipboard.bind(this));
        this.downloadBtn.addEventListener('click', this.downloadTXT.bind(this));
    }
    
    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }
    
    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }
    
    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            this.loadImage(files[0]);
        }
    }
    
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.loadImage(file);
        }
    }
    
    loadImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.currentImage = img;
                this.previewImg.src = e.target.result;
                this.showImagePreview();
                this.generateBtn.disabled = false;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    showImagePreview() {
        this.uploadArea.style.display = 'none';
        this.imagePreview.style.display = 'block';
    }
    
    removeImage() {
        this.currentImage = null;
        this.uploadArea.style.display = 'block';
        this.imagePreview.style.display = 'none';
        this.fileInput.value = '';
        this.generateBtn.disabled = true;
        this.resetOutput();
    }
    
    updateDensityValue() {
        this.densityValue.textContent = this.densitySlider.value;
    }
    
    generateASCII() {
        if (!this.currentImage) return;
        
        this.generateBtn.disabled = true;
        this.generateBtn.textContent = 'Generating...';
        
        // Use setTimeout to allow UI to update
        setTimeout(() => {
            this.convertToASCII();
            this.generateBtn.disabled = false;
            this.generateBtn.textContent = 'Generate ASCII Art';
        }, 100);
    }
    
    convertToASCII() {
        const density = parseInt(this.densitySlider.value);
        const charSet = this.characterSets[this.charSetSelect.value];
        const useColor = this.colorToggle.checked;
        const tintColor = this.colorPicker.value;
        
        // Calculate dimensions maintaining aspect ratio
        const aspectRatio = this.currentImage.width / this.currentImage.height;
        const width = density;
        const height = Math.floor(density / aspectRatio / 2); // Divide by 2 for character aspect ratio
        
        // Set canvas size and draw image
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.drawImage(this.currentImage, 0, 0, width, height);
        
        // Get image data
        const imageData = this.ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        let ascii = '';
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                
                // Calculate brightness
                const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
                
                // Get character based on brightness
                const charIndex = Math.floor(brightness * (charSet.length - 1));
                const char = charSet[charIndex];
                
                if (useColor) {
                    // Apply color to character
                    const color = this.blendColors(r, g, b, tintColor);
                    ascii += `<span style="color: rgb(${color.r}, ${color.g}, ${color.b})">${char}</span>`;
                } else {
                    ascii += char;
                }
            }
            ascii += '\n';
        }
        
        this.asciiResult = ascii;
        this.displayResult(ascii, useColor);
        this.enableExportButtons();
    }
    
    blendColors(r, g, b, tintHex) {
        // Convert hex to RGB
        const tintR = parseInt(tintHex.slice(1, 3), 16);
        const tintG = parseInt(tintHex.slice(3, 5), 16);
        const tintB = parseInt(tintHex.slice(5, 7), 16);
        
        // Blend original color with tint (50/50 mix)
        return {
            r: Math.floor((r + tintR) / 2),
            g: Math.floor((g + tintG) / 2),
            b: Math.floor((b + tintB) / 2)
        };
    }
    
    displayResult(ascii, useColor) {
        this.asciiOutput.innerHTML = '';
        
        if (useColor) {
            this.asciiOutput.innerHTML = ascii;
        } else {
            this.asciiOutput.textContent = ascii;
        }
        
        // Scroll to output
        this.asciiOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    enableExportButtons() {
        this.copyBtn.disabled = false;
        this.downloadBtn.disabled = false;
    }
    
    resetOutput() {
        this.asciiOutput.innerHTML = '<p class="placeholder">Upload an image and click "Generate ASCII Art" to see the result</p>';
        this.copyBtn.disabled = true;
        this.downloadBtn.disabled = true;
        this.asciiResult = '';
    }
    
    async copyToClipboard() {
        if (!this.asciiResult) return;
        
        try {
            // Create plain text version (strip HTML if colored)
            const plainText = this.asciiResult.replace(/<[^>]*>/g, '');
            await navigator.clipboard.writeText(plainText);
            
            // Visual feedback
            const originalText = this.copyBtn.textContent;
            this.copyBtn.textContent = 'Copied!';
            this.copyBtn.style.background = '#48bb78';
            
            setTimeout(() => {
                this.copyBtn.textContent = originalText;
                this.copyBtn.style.background = '';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
            alert('Failed to copy to clipboard. Please try again.');
        }
    }
    
    downloadTXT() {
        if (!this.asciiResult) return;
        
        // Create plain text version (strip HTML if colored)
        const plainText = this.asciiResult.replace(/<[^>]*>/g, '');
        
        // Create blob and download
        const blob = new Blob([plainText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ascii-art.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Visual feedback
        const originalText = this.downloadBtn.textContent;
        this.downloadBtn.textContent = 'Downloaded!';
        this.downloadBtn.style.background = '#48bb78';
        
        setTimeout(() => {
            this.downloadBtn.textContent = originalText;
            this.downloadBtn.style.background = '';
        }, 2000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ASCIIConverter();
});

// Prevent default drag behavior on the whole page
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => e.preventDefault());
