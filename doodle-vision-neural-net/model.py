import tkinter as tk
from tkinter import messagebox
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from PIL import Image, ImageDraw
import io
import matplotlib.pyplot as plt

# Load and preprocess MNIST dataset
def load_and_preprocess_data():
    (x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
    x_train = x_train.reshape((60000, 28, 28, 1)).astype('float32') / 255
    x_test = x_test.reshape((10000, 28, 28, 1)).astype('float32') / 255
    y_train = tf.keras.utils.to_categorical(y_train)
    y_test = tf.keras.utils.to_categorical(y_test)
    return x_train, y_train, x_test, y_test

# Build and train CNN model
def build_and_train_model():
    x_train, y_train, x_test, y_test = load_and_preprocess_data()
    
    model = models.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.Flatten(),
        layers.Dense(64, activation='relu'),
        layers.Dense(10, activation='softmax')
    ])
    
    model.compile(optimizer='adam',
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])
    
    model.fit(x_train, y_train, epochs=5, batch_size=64, validation_data=(x_test, y_test))
    return model

# GUI Application
class DigitRecognizerApp:
    def __init__(self, root, model):
        self.root = root
        self.root.title("Digit Recognizer")
        self.model = model
        
        # Canvas for drawing
        self.canvas = tk.Canvas(root, width=200, height=200, bg='white')
        self.canvas.pack(pady=10)
        
        # Buttons
        self.predict_btn = tk.Button(root, text="Predict", command=self.predict_digit)
        self.predict_btn.pack()
        self.clear_btn = tk.Button(root, text="Clear", command=self.clear_canvas)
        self.clear_btn.pack()
        
        # Label for prediction
        self.result_label = tk.Label(root, text="Draw a digit and click Predict")
        self.result_label.pack(pady=10)
        
        # Drawing setup
        self.image = Image.new("L", (200, 200), 255)  # White background
        self.draw = ImageDraw.Draw(self.image)
        self.last_x, self.last_y = None, None
        
        # Bind mouse events
        self.canvas.bind("<B1-Motion>", self.draw_line)
        self.canvas.bind("<ButtonRelease-1>", self.reset_last)
        
    def draw_line(self, event):
        x, y = event.x, event.y
        if self.last_x is not None and self.last_y is not None:
            self.canvas.create_line(self.last_x, self.last_y, x, y, width=10, fill='black')
            self.draw.line([self.last_x, self.last_y, x, y], fill=0, width=10)
        self.last_x, self.last_y = x, y
    
    def reset_last(self, event):
        self.last_x, self.last_y = None, None
    
    def clear_canvas(self):
        self.canvas.delete("all")
        self.image = Image.new("L", (200, 200), 255)
        self.draw = ImageDraw.Draw(self.image)
        self.result_label.config(text="Draw a digit and click Predict")
    
    def preprocess_image(self):
        # Resize to 28x28
        img = self.image.resize((28, 28))
        img_array = np.array(img)
        # Invert colors (MNIST has white digits on black background)
        img_array = 255 - img_array
        # Normalize
        img_array = img_array.astype('float32') / 255
        # Reshape for model
        img_array = img_array.reshape(1, 28, 28, 1)
        return img_array
    
    def predict_digit(self):
        img_array = self.preprocess_image()
        prediction = self.model.predict(img_array)
        digit = np.argmax(prediction)
        confidence = np.max(prediction)
        self.result_label.config(text=f"Predicted: {digit} (Confidence: {confidence:.2%})")

if __name__ == "__main__":
    # Train model
    print("Training model...")
    model = build_and_train_model()
    
    # Start GUI
    root = tk.Tk()
    app = DigitRecognizerApp(root, model)
    root.mainloop()