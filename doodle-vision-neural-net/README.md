# DoodleVision 🎨🔍

**An Interactive Computer Vision Project for Real-Time Drawing Recognition**

DoodleVision is a comprehensive machine learning project that combines the power of Convolutional Neural Networks (CNNs) with interactive drawing interfaces. The project features two distinct recognition systems: a digit recognizer for handwritten numbers and an advanced object recognizer for sketched drawings, complete with real-time feature space visualization.

## ✨ Features

### 🔢 **Digit Recognition System**
- **Interactive Drawing Canvas**: Draw digits (0-9) with your mouse
- **Real-time Prediction**: Instant recognition with confidence scores
- **MNIST-trained CNN**: High-accuracy model trained on 60,000 handwritten digits
- **Clean GUI Interface**: Simple and intuitive Tkinter-based interface

### 🎨 **Object Recognition System**
- **Multi-class Object Recognition**: Recognizes 10 different object categories
- **QuickDraw Dataset Integration**: Trained on Google's QuickDraw dataset
- **Feature Space Visualization**: Interactive t-SNE visualization of CNN internal representations
- **Advanced CNN Architecture**: Deep learning model with dropout and regularization
- **Dual Interface**: Main canvas + specialized doodle dialog for visualization

### 📊 **Visualization & Analysis**
- **t-SNE Feature Mapping**: 2D visualization of high-dimensional CNN features
- **Interactive Plotting**: Real-time plotting of user drawings in feature space
- **Category Clustering**: Visual representation of how the model groups different objects
- **Confidence Scoring**: Detailed prediction confidence for all classifications

## 🏗️ **Architecture Overview**

```
DoodleVision/
├── model.py           # MNIST digit recognition application
├── images.py          # QuickDraw object recognition application  
├── imagenew.ipynb     # Jupyter notebook for experimentation
├── imageplot.ipynb    # Additional analysis and plotting notebook
├── feature_space.png  # Generated t-SNE visualization
└── .quickdrawcache/   # Cached QuickDraw dataset files
```

## 🚀 **Quick Start**

### Prerequisites
```bash
# Python 3.7+ required
pip install tensorflow keras numpy matplotlib pillow scikit-learn quickdraw tkinter
```

### **Option 1: Digit Recognition**
```bash
python model.py
```
- Draw any digit (0-9) on the canvas
- Click "Predict" to see the model's prediction
- View confidence scores in real-time

### **Option 2: Object Recognition with Visualization**
```bash
python images.py
```
- Draw objects from: cat, dog, tree, house, car, apple, chair, bird, fish, flower
- Use "Predict" for basic recognition
- Click "Open Doodle Dialog" for advanced visualization features

## 🧠 **Technical Details**

### **CNN Architecture (Object Recognition)**
```python
Input Layer: (28, 28, 1)
├── Conv2D(32, 3x3) + ReLU + MaxPool(2x2)
├── Conv2D(64, 3x3) + ReLU + MaxPool(2x2) 
├── Conv2D(128, 3x3) + ReLU
├── Flatten
├── Dense(128) + ReLU + Dropout(0.5)  # Feature Layer
└── Dense(10) + Softmax                # Output Layer
```

### **Dataset Information**
- **MNIST**: 60,000 training + 10,000 test images of handwritten digits
- **QuickDraw**: 1,000 images per category × 10 categories = 10,000 total drawings
- **Categories**: cat, dog, tree, house, car, apple, chair, bird, fish, flower
- **Image Size**: 28×28 grayscale for both datasets

### **Key Technologies**
- **TensorFlow/Keras**: Deep learning framework
- **Tkinter**: GUI development
- **PIL (Pillow)**: Image processing
- **scikit-learn**: Machine learning utilities (t-SNE, train/test split)
- **NumPy**: Numerical computing
- **Matplotlib**: Data visualization

## 🎯 **Use Cases**

1. **Educational Tool**: Learn about CNN architectures and computer vision
2. **Interactive Demo**: Showcase machine learning capabilities to others
3. **Research Platform**: Experiment with different CNN architectures
4. **Feature Analysis**: Understand how CNNs learn and represent visual features
5. **Art & Technology**: Bridge between creative drawing and AI recognition

## 📈 **Model Performance**

### Digit Recognition (MNIST)
- **Training Accuracy**: ~99%
- **Validation Accuracy**: ~98%
- **Training Time**: ~2-3 minutes on modern hardware

### Object Recognition (QuickDraw)
- **Training Accuracy**: ~85%
- **Validation Accuracy**: ~84%
- **Training Time**: ~5-7 minutes on modern hardware

## 🔧 **Advanced Features**

### Feature Space Visualization
The object recognition system includes sophisticated visualization capabilities:
- **t-SNE Dimensionality Reduction**: Maps 128-dimensional CNN features to 2D space
- **Interactive Plotting**: Your drawings appear as red stars in the feature space
- **Category Clustering**: Observe how similar objects cluster together
- **Real-time Updates**: See where your drawing lands in the learned feature space

### Extensibility
The modular design makes it easy to:
- Add new object categories
- Experiment with different CNN architectures
- Integrate additional datasets
- Customize the GUI interface

## 🛠️ **Development Setup**

### For Jupyter Notebook Development
```bash
jupyter notebook imagenew.ipynb  # Main experimentation notebook
jupyter notebook imageplot.ipynb # Additional analysis
```

### For Custom Model Training
```python
# Modify these parameters in images.py
CATEGORIES = ["cat", "dog", ...]  # Add your categories
IMAGES_PER_CATEGORY = 1000        # Adjust dataset size
IMG_SIZE = (28, 28)               # Modify image dimensions
```

## 🤝 **Contributing**

We welcome contributions! Here are some ideas:
- Add more object categories
- Implement different CNN architectures
- Add data augmentation techniques
- Improve the GUI interface
- Add model saving/loading functionality
- Implement confidence threshold adjustments

## 📝 **License**

This project is open source and available under the MIT License.

## 🙏 **Acknowledgments**

- **MNIST Dataset**: Yann LeCun's handwritten digit database
- **QuickDraw Dataset**: Google's collection of sketched drawings
- **TensorFlow Team**: For the excellent deep learning framework
- **Open Source Community**: For the various Python libraries that made this possible

---

**Ready to start recognizing your doodles? Run the applications and start drawing! 🎨** 