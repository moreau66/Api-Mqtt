import json
from pathlib import Path

CONFIG_FILE = Path(__file__).parent / "storage" / "config.json"

def load_config():
    with open(CONFIG_FILE) as f:
        return json.load(f)

def save_config(data):
    with open(CONFIG_FILE, 'w') as f:
        json.dump(data, f, indent=2)
