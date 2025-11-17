from ultralytics import YOLO

# using small model with around 80 classes
# class 2: car, 7: truck
model = YOLO("yolov5su.pt")
filter_classes = [2, 7]

def detect(image_path):
    """
    Input:
        image_path - path of image

    Output:
        vehicle_counter - number of vehicles detected
        image_size - size of image
        vehicle_data - list of vehicle detections with [class of vehicle, confidence score, [normalized xmin, normalized ymin, normalized xmax, normalized ymax]]
    """

    vehicle_counter = 0
    vehicle_data = []
    result = model(image_path)[0]
    image_size = result.orig_shape
    for i in result.boxes:
        if i.cls.item() in filter_classes:
            vehicle_counter += 1
            # xyxyn means relative to image size
            # x goes from left to right of image
            # y goes from top to bottom of image
            # orig_shape is of format (height, width)
            vehicle_data.append([i.cls.item(), i.conf.item(), i.xyxyn.flatten().tolist()])
    return vehicle_counter, image_size, vehicle_data

if __name__ == "__main__":
    print(detect('image_path_here'))
