# fastapi pending
from routes import detect_vehicle

if __name__ == "__main__":
    print("Analyzing image...")
    result = detect_vehicle.detect("sample.jpeg")
    print("Results:")
    print(result)
