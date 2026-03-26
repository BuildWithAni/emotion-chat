import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import joblib
import os

# Sample training data for different emotions in chat
# In a real scenario, this would load a larger dataset.
data = [
    ("I am so happy!", "happy"),
    ("This is a wonderful day.", "happy"),
    ("I'm feeling great!", "happy"),
    ("I love this!", "happy"),
    ("This is amazing.", "happy"),
    
    ("I'm feeling so sad.", "sad"),
    ("This is frustrating.", "sad"),
    ("I feel alone and lonely.", "sad"),
    ("Everything is going wrong.", "sad"),
    ("I want to cry.", "sad"),
    
    ("I am absolutely furious!", "angry"),
    ("This is unacceptable.", "angry"),
    ("Stop doing this right now!", "angry"),
    ("I hate this situation.", "angry"),
    ("I'm so annoyed.", "angry"),
    
    ("I feel a bit scared.", "fear"),
    ("What if something happens?", "fear"),
    ("I'm terrified.", "fear"),
    ("It's so dark and spooky.", "fear"),
    ("I am nervous about this.", "fear"),
    
    ("I'm just neutral.", "neutral"),
    ("Okay, that makes sense.", "neutral"),
    ("I'm going to the store.", "neutral"),
    ("The weather is fine.", "neutral"),
    ("Tell me more about it.", "neutral")
]

def train():
    df = pd.DataFrame(data, columns=['text', 'emotion'])
    
    # Create a simple NLP pipeline
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english')),
        ('clf', MultinomialNB())
    ])
    
    # Train
    pipeline.fit(df['text'], df['emotion'])
    
    # Save the pipeline
    joblib.dump(pipeline, 'model_pipeline.pkl')
    print("Model trained and saved as model_pipeline.pkl")

if __name__ == "__main__":
    train()