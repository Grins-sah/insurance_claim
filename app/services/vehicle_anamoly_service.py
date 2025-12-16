import os
import sys
import numpy as np
from skimage import io
from external.vehicle_anomaly_model.custom import CustomConfig
from external.vehicle_anomaly_model.model import model as modellib

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../external/vehicle_anomaly_model"))
MODEL_WEIGHTS_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../weights/mask_rcnn_coco.h5"))

class VehicleAnomalyService:
    def __init__(self):
        self.config = CustomConfig()
        self.model = modellib.MaskRCNN(mode="inference", model_dir=ROOT_DIR, config=self.config)
        self.model.load_weights(MODEL_WEIGHTS_PATH, by_name=True)

    def detect_anomalies(self, image_path):
        image = io.imread(image_path)

        results = self.model.detect([image], verbose=1)
        r = results[0]

        detections = []
        for i in range(len(r['rois'])):
            detections.append({
                "bounding_box": r['rois'][i].tolist(),
                "class_id": r['class_ids'][i],
                "score": r['scores'][i]
            })

        return detections

vehicle_anomaly_service = VehicleAnomalyService()