import joblib
import os

class EmotionModel:
    def __init__(self, model_path='model_pipeline.pkl'):
        # In a real app, I'd load the model trained by train_model.py
        # For this demo, we'll try to load it or fall back to a simple logic
        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
            print("Model loaded successfully.")
        else:
            print("Warning: Model pipeline not found. Please run train_model.py first!")
            self.model = None

    def predict(self, text):
        if self.model:
            return self.model.predict([text])[0]
        else:
            # Simple fallback if model isn't trained
            text = text.lower()
            if any(word in text for word in ["happy", "great", "love", "amazing", "good"]): return "happy"
            if any(word in text for word in ["sad", "lonely", "wrong", "cry"]): return "sad"
            if any(word in text for word in ["angry", "hate", "annoying", "stop"]): return "angry"
            if any(word in text for word in ["scared", "fear", "terrified", "nervous"]): return "fear"
            return "neutral"

# Singleton pattern
emotion_model = EmotionModel()