sudo apt install screen -y
sudo apt install python3.12-venv -y
python3 -m venv kami
sudo systemctl disable ssh.socket
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg \
&& sudo install -o root -g root -m 644 microsoft.gpg /etc/apt/trusted.gpg.d/ \
&& sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list' \
&& sudo apt update && sudo apt install -y code \
&& rm microsoft.gpg
source kami/bin/activate
pip install pyautogui 
sudo apt-get install python3-tk python3-dev -y
code kami.txt
export DISPLAY=:1
screen python run.py
