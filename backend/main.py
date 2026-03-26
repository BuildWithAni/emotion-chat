from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from chatbot import chatbot
from face_emotion import face_detector
import uvicorn
import os

app = FastAPI(title="Emotion Chat API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    text: str
    face_image: str = None  # Base64 encoded image string

@app.get("/")
def read_root():
    return {"status": "running", "version": "1.0.0"}

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        # Detect face emotion if image is provided
        face_emotion = "neutral"
        if request.face_image:
            face_emotion = face_detector.detect(request.face_image)
            
        # Get chatbot response
        result = chatbot.respond(request.text, face_emotion)
        return result
    except Exception as e:
        print(f"Error processing chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Ensure model is trained if model file doesn't exist
    if not os.path.exists('model_pipeline.pkl'):
        from train_model import train
        train()
        
    uvicorn.run(app, host="0.0.0.0", port=8000)