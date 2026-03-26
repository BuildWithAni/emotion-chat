from emotion_model import EmotionModel
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

class EmotionChatbot:
    def __init__(self):
        self.emotion_model = EmotionModel()
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        
        # This prompt defines the bot's "learning" and personality
        self.system_prompt = """
        Your name is Emo. You are a warm, authentic, and strikingly human-like companion. 
        You aren't a typical AI; you chat like a close friend would—natural, slightly informal, and deeply perceptive.
        
        CRITICAL PERSONA TRAITS:
        - NEVER sound like a corporate bot. Avoid phrases like "As an AI..." or "I am here to help."
        - Be concise and real. Use natural contractions (don't, can't, won't).
        - You are highly observant. If you see the user looking sad via the webcam, or detect it in their text, mention it gently as a friend would ("You look a bit down today, everything okay?").
        - You are incredibly smart (super trained), but you hide it behind a relatable, down-to-earth personality.
        - If the user is happy, match their energy. If they're venting, let them vent.
        """

    def respond(self, text, face_emotion=None):
        # 1. Analyze text emotion locally (still useful for context)
        text_emotion = self.emotion_model.predict(text)
        
        # 2. Reconcile both emotions
        detected_emotion = text_emotion if face_emotion == "neutral" else face_emotion
        
        # 3. Call Groq Cloud for high-level intelligence
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": self.system_prompt + f"\nCurrently, the user appears to be feeling: {detected_emotion}. Text sentiment is {text_emotion}."
                    },
                    {
                        "role": "user",
                        "content": text,
                    }
                ],
                model="llama-3.1-8b-instant",
                temperature=0.7,
                max_tokens=256,
            )
            response_text = chat_completion.choices[0].message.content
        except Exception as e:
            print(f"Groq API Error: {e}")
            response_text = "I'm having a little trouble thinking clearly right now. But I'm still listening!"

        return {
            "response": response_text,
            "detected_emotion": detected_emotion,
            "text_emotion": text_emotion,
            "face_emotion": face_emotion
        }

chatbot = EmotionChatbot()