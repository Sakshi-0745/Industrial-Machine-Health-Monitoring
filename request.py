import requests
import json

url = "https://9uuzmgq5p3.execute-api.ap-south-1.amazonaws.com"

data = {
    "temperature": 78,
    "vibration": 0.05
}

response = requests.post(url, json=data)
print("Response:", response.text)
