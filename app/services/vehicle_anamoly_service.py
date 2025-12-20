import logging
import numpy as np
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForImageClassification
import torch

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class VehicleAnomalyService:
    def __init__(self, device='cpu'):
        logger.info("Initializing VehicleAnomalyService with Hugging Face model...")
        self.device = "cuda" if device == 'cuda' and torch.cuda.is_available() else "cpu"
        logger.info(f"Using device: {self.device}")
        
        try:
            self.processor = AutoImageProcessor.from_pretrained("beingamit99/car_damage_detection")
            self.model = AutoModelForImageClassification.from_pretrained("beingamit99/car_damage_detection")
            self.model.to(self.device)
            logger.info("Model initialized successfully.")
        except Exception as e:
            logger.error(f"Error initializing model: {e}")
            raise e

    def detect_anomalies(self, image_path):
        logger.info(f"Detecting anomalies for image: {image_path}")
        try:
            image = Image.open(image_path)
            # Ensure image is in RGB
            if image.mode != "RGB":
                image = image.convert("RGB")
                
            inputs = self.processor(images=image, return_tensors="pt")
            inputs = {k: v.to(self.device) for k, v in inputs.items()}

            # Make predictions
            with torch.no_grad():
                outputs = self.model(**inputs)
            
            logits = outputs.logits.detach().cpu().numpy()
            # The model output shape is (1, num_classes)
            # We want the class with the highest score
            predicted_class_id = np.argmax(logits, axis=1)[0]
            # Apply softmax to get probabilities if logits are raw scores
            probs = torch.nn.functional.softmax(torch.tensor(logits), dim=1).numpy()[0]
            predicted_proba = probs[predicted_class_id]
            
            label_map = self.model.config.id2label
            predicted_class_name = label_map[predicted_class_id]

            logger.info(f"Predicted class: {predicted_class_name} (probability: {predicted_proba:.4f})")
            
            return {
                "predicted_class": predicted_class_name,
                "probability": float(predicted_proba)
            }
        except Exception as e:
            logger.error(f"Error during anomaly detection: {e}")
            raise e
