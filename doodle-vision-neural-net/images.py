import tkinter as tk
from tkinter import messagebox
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from PIL import Image, ImageDraw
import os
from quickdraw import QuickDrawDataGroup
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE

# Selected object categories from Quick, Draw! (10 categories)
CATEGORIES = ["cat", "dog", "tree", "house", "car", "apple", "chair", "bird", "fish", "flower"]
NUM_CLASSES = len(CATEGORIES)
IMG_SIZE = (28, 28)
IMAGES_PER_CATEGORY = 1000  # Reduced for testing; revert to 10000 if needed

# Load and preprocess Quick, Draw! dataset
def load_and_preprocess_data():
    x_data = []
    y_data = []
    
    for idx, category in enumerate(CATEGORIES):
        print(f"Loading {category} data...")
        qd_group = QuickDrawDataGroup(category, max_drawings=IMAGES_PER_CATEGORY, recognized=True)
        images = []
        
        for drawing in qd_group.drawings:
            img = drawing.get_image(stroke_width=3).resize(IMG_SIZE).convert("L")
            img_array = np.array(img)
            img_array = 255 - img_array
            images.append(img_array)
        
        x_data.extend(images)
        y_data.extend([idx] * len(images))
    
    x_data = np.array(x_data).reshape(-1, 28, 28, 1).astype('float32') / 255
    y_data = tf.keras.utils.to_categorical(y_data, NUM_CLASSES)
    
    x_train, x_test, y_train, y_test = train_test_split(x_data, y_data, test_size=0.2, random_state=42)
    
    return x_train, y_train, x_test, y_test

# Build and train CNN model using Functional API
def build_and_train_model():
    x_train, y_train, x_test, y_test = load_and_preprocess_data()
    
    inputs = layers.Input(shape=(28, 28, 1))
    x = layers.Conv2D(32, (3, 3), activation='relu')(inputs)
    x = layers.MaxPooling2D((2, 2))(x)
    x = layers.Conv2D(64, (3, 3), activation='relu')(x)
    x = layers.MaxPooling2D((2, 2))(x)
    x = layers.Conv2D(128, (3, 3), activation='relu')(x)
    x = layers.Flatten()(x)
    x = layers.Dense(128, activation='relu', name='feature_layer')(x)
    x = layers.Dropout(0.5)(x)
    outputs = layers.Dense(NUM_CLASSES, activation='softmax')(x)
    
    model = models.Model(inputs=inputs, outputs=outputs)
    
    model.compile(optimizer='adam',
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])
    
    model.fit(x_train, y_train, epochs=10, batch_size=128, validation_data=(x_test, y_test))
    return model, x_test, y_test

# Visualize the CNN's feature space with optional doodle point
def visualize_feature_space(model, x_test, y_test, categories, doodle_features=None, doodle_label=None, save_path="feature_space.png"):
    feature_model = tf.keras.Model(inputs=model.input, outputs=model.get_layer('feature_layer').output)
    features = feature_model.predict(x_test)
    
    # Include doodle features if provided
    if doodle_features is not None:
        features = np.vstack([features, doodle_features])
    
    # Fit t-SNE
    tsne = TSNE(n_components=2, random_state=42, perplexity=30, n_iter=300)
    features_2d = tsne.fit_transform(features)
    
    # Plot
    plt.figure(figsize=(10, 8))
    for i, category in enumerate(categories):
        mask = np.argmax(y_test, axis=1) == i
        plt.scatter(features_2d[mask, 0], features_2d[mask, 1], label=category, alpha=0.6, s=50)
    
    # Plot doodle if provided
    if doodle_features is not None:
        plt.scatter(features_2d[-1, 0], features_2d[-1, 1], c='red', marker='*', s=200, label=f'Doodle ({doodle_label})', edgecolors='black')
    
    plt.title("t-SNE Visualization of CNN Feature Space")
    plt.xlabel("t-SNE Dimension 1")
    plt.ylabel("t-SNE Dimension 2")
    plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
    plt.tight_layout()
    plt.savefig(save_path)
    plt.show(block=True)  # Ensure plot displays
    
    return tsne

# GUI Application with dialog box for doodle
class ObjectRecognizerApp:
    def __init__(self, root, model, x_test, y_test):
        self.root = root
        self.model = model
        self.x_test = x_test
        self.y_test = y_test
        self.root.title("Object Recognizer")
        
        # Main canvas for drawing
        self.canvas = tk.Canvas(root, width=200, height=200, bg='white')
        self.canvas.pack(pady=10)
        
        # Buttons
        self.predict_btn = tk.Button(root, text="Predict", command=self.predict_object)
        self.predict_btn.pack()
        self.clear_btn = tk.Button(root, text="Clear", command=self.clear_canvas)
        self.clear_btn.pack()
        self.doodle_btn = tk.Button(root, text="Open Doodle Dialog", command=self.open_doodle_dialog)
        self.doodle_btn.pack()
        
        # Label for prediction
        self.result_label = tk.Label(root, text="Draw an object and click Predict")
        self.result_label.pack(pady=10)
        
        # Drawing setup
        self.image = Image.new("L", (200, 200), 255)
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
        self.result_label.config(text="Draw an object and click Predict")
    
    def preprocess_image(self, image):
        img = image.resize((28, 28))
        img_array = np.array(img)
        img_array = 255 - img_array
        img_array = img_array.astype('float32') / 255
        img_array = img_array.reshape(1, 28, 28, 1)
        return img_array
    
    def predict_object(self):
        img_array = self.preprocess_image(self.image)
        prediction = self.model.predict(img_array)
        object_idx = np.argmax(prediction)
        object_name = CATEGORIES[object_idx]
        confidence = np.max(prediction)
        self.result_label.config(text=f"Predicted: {object_name} (Confidence: {confidence:.2%})")
    
def open_doodle_dialog(self):
    print("Opening doodle dialog...")  # Debug print

    self.dialog = tk.Toplevel(self.root)  # Store reference
    self.dialog.title("Doodle and Visualize")
    self.dialog.geometry("300x400+100+100")  # Explicit position
    self.dialog.transient(self.root)
    self.dialog.grab_set()

    canvas = tk.Canvas(self.dialog, width=200, height=200, bg='white')
    canvas.pack(pady=10)

    image = Image.new("L", (200, 200), 255)
    draw = ImageDraw.Draw(image)
    last = {"x": None, "y": None}

    def draw_line(event):
        if last["x"] is not None and last["y"] is not None:
            canvas.create_line(last["x"], last["y"], event.x, event.y, width=10, fill='black')
            draw.line([last["x"], last["y"], event.x, event.y], fill=0, width=10)
        last["x"], last["y"] = event.x, event.y

    def reset_last(event):
        last["x"], last["y"] = None, None

    canvas.bind("<B1-Motion>", draw_line)
    canvas.bind("<ButtonRelease-1>", reset_last)

    result_label = tk.Label(self.dialog, text="Draw and click Predict")
    result_label.pack(pady=10)

    def predict_and_visualize():
        img_array = self.preprocess_image(image)
        prediction = self.model.predict(img_array)
        object_idx = np.argmax(prediction)
        object_name = CATEGORIES[object_idx]
        confidence = np.max(prediction)
        result_label.config(text=f"Predicted: {object_name} (Confidence: {confidence:.2%})")

        feature_model = tf.keras.Model(inputs=self.model.input, outputs=self.model.get_layer('feature_layer').output)
        doodle_features = feature_model.predict(img_array)

        self.visualize_doodle(doodle_features, object_name)

    predict_btn = tk.Button(self.dialog, text="Predict and Visualize", command=predict_and_visualize)
    predict_btn.pack()

    def clear_doodle():
        canvas.delete("all")
        image.paste(255, (0, 0, 200, 200))
        result_label.config(text="Draw and click Predict")
        last["x"], last["y"] = None, None

    clear_btn = tk.Button(self.dialog, text="Clear", command=clear_doodle)
    clear_btn.pack()


if __name__ == "__main__":
    print("Training model...")
    model, x_test, y_test = build_and_train_model()
    
    print("Generating feature space visualization...")
    tsne_model = visualize_feature_space(model, x_test, y_test, CATEGORIES)
    
    root = tk.Tk()
    app = ObjectRecognizerApp(root, model, x_test, y_test)
    root.mainloop()