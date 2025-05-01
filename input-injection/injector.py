import pyautogui
import socketio

sio = socketio.Client()

@sio.event
def connect():
    print("✅ Connected to server!")

@sio.event
def disconnect():
    print("❌ Disconnected from input server!")

@sio.event
def connect_error(data):
    print("❌ Connection failed:", data)

@sio.on('input')
def on_input(data):
    print("🎮 Injecting:", data)
    t = data.get("type")

    if t == "keydown":
        pyautogui.keyDown(data["key"])
    elif t == "keyup":
        pyautogui.keyUp(data["key"])
    elif t == "mousedown":
        if data["button"] == 0:
            pyautogui.mouseDown(button="left")
        elif data["button"] == 1:
            pyautogui.mouseDown(button="middle")
        elif data["button"] == 2:
            pyautogui.mouseDown(button="right")
    elif t == "mouseup":
        if data["button"] == 0:
            pyautogui.mouseUp(button="left")
        elif data["button"] == 1:
            pyautogui.mouseUp(button="middle")
        elif data["button"] == 2:
            pyautogui.mouseUp(button="right")
    elif t == "mousemove":
        screen_width, screen_height = pyautogui.size()
        x = int(data["x"] * screen_width)
        y = int(data["y"] * screen_height)
        pyautogui.moveTo(x, y)


# Connect to your Node.js server
try:
    sio.connect('http://localhost:3000')
    sio.wait()
except Exception as e:
    print(f"❌ Error connecting to the server: {e}")
