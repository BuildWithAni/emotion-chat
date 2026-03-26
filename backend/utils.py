# Utility functions for the emotion chat system

def format_timestamp(ts):
    return ts.strftime("%H:%M")

def validate_image_data(image_data):
    if not image_data:
        return False
    return image_data.startswith("data:image/")