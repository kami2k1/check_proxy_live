import pyautogui
import random
import time
import string


strong_chars = string.ascii_letters + string.digits + string.punctuation

while True:
    key = random.choice(strong_chars)
    pyautogui.write(key)
    print(f"Gửi phím: {key}")
    time.sleep(5)
