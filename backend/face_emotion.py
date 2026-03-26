import mediapipe as mp
import numpy as np
import cv2
import base64

class FaceEmotionDetector:
    def __init__(self):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

    def detect(self, image_data):
        # image_data expected to be a base64 decoded numpy array or direct bytes
        # Let's decode if it's a string
        if isinstance(image_data, str):
            # assume it's base64 encoded string from the frontend
            try:
                if ',' in image_data:
                    image_data = image_data.split(',')[1]
                decoded_image = base64.b64decode(image_data)
                nparr = np.frombuffer(decoded_image, np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            except Exception as e:
                print(f"Error decoding image: {e}")
                return "neutral"
        else:
            img = image_data

        if img is None:
            return "neutral"

        # Process the image to get face landmarks
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_img)

        if results.multi_face_landmarks:
            landmarks = results.multi_face_landmarks[0].landmark
            
            # Simple heuristic mapping for emotions using landmarks
            # (Note: For a production app, I'd train a mini-classifier on these landmarks)
            
            # Distance between upper and lower lips
            lip_dist = abs(landmarks[13].y - landmarks[14].y)
            # Distance between corners of the mouth (horizontal)
            mouth_width = abs(landmarks[61].x - landmarks[291].x)
            # Vertical distance of mouth corners
            mouth_corner_avg_y = (landmarks[61].y + landmarks[291].y) / 2
            mouth_center_y = (landmarks[13].y + landmarks[14].y) / 2
            
            # Eyebrow height
            left_eyebrow_y = (landmarks[52].y + landmarks[65].y) / 2
            right_eyebrow_y = (landmarks[282].y + landmarks[295].y) / 2
            
            # Logic (This is a simplified version for demonstration)
            # Smile: mouth corners are higher than the center of the mouth
            if mouth_corner_avg_y < mouth_center_y - 0.005:
                return "happy"
            # Frown (sad): mouth corners are lower than mouth center
            elif mouth_corner_avg_y > mouth_center_y + 0.01:
                return "sad"
            # Wide mouth: angry/shocked/fear
            elif lip_dist > 0.1:
                return "alarmed"
            # Brows low: angry
            elif (left_eyebrow_y + right_eyebrow_y) / 2 > landmarks[168].y + 0.02:
                return "angry"
            else:
                return "neutral"
        
        return "neutral"

# Singleton
face_detector = FaceEmotionDetector()