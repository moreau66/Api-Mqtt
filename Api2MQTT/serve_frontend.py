import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

frontend_path = os.path.join(os.path.dirname(__file__), "frontend/dist")
if os.path.isdir(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
