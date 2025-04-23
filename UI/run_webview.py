import webview
import requests
from time import sleep

app_name = "Desktop App"
port = 5000
url = f"http://127.0.0.1:{port}"

# Function to check if Flask is ready
def is_flask_ready():
    try:
        response = requests.get(url)
        return response.status_code == 200
    except requests.ConnectionError:
        return False

# Wait for Flask to start
while not is_flask_ready():
    print(f"Waiting for Flask to start at {url}...")
    sleep(1)

# Start WebView
window = webview.create_window(app_name, url)
webview.start()
