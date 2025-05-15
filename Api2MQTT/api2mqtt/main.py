import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from api2mqtt.routes import bridge_routes, mqtt_routes, http_routes

app = FastAPI(title="Api2MQTT")

app.include_router(bridge_routes.router, prefix="/bridges", tags=["Bridges"])
app.include_router(mqtt_routes.router, prefix="/mqtt", tags=["MQTT"])
app.include_router(http_routes.router, prefix="/http", tags=["HTTP"])

# Serve frontend if ENABLE_FRONTEND is true
if os.getenv("ENABLE_FRONTEND", "false").lower() == "true":
    frontend_path = os.path.join(os.path.dirname(__file__), "../frontend_dist")
    if os.path.isdir(frontend_path):
        app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
