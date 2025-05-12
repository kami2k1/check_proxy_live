import random , os

def pro(name ):
# Load file proxy
    with open("http.txt", "r") as f:
       return  [line.strip() for line in f if line.strip()]
    return []
def get():
    os.system("node f.js")
    os.system("node ch.js")
    http = pro("http.txt")
    socks4 = pro("socks4.txt")
    socks5 = pro('socks5.txt')
    ALL= []
    for h in http:
        ALL.append(f"http://{h}")
    for h in socks4:
        ALL.append(f"socks4://{h}")
    for h in socks5:
        ALL.append(f"socks4://{h}")
    return ALL
print(get())
