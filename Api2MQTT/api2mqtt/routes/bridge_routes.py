from fastapi import APIRouter, HTTPException
from api2mqtt.config import load_config, save_config

router = APIRouter()

@router.get("/")
def list_bridges():
    return load_config()

@router.post("/")
def add_bridge(bridge: dict):
    config = load_config()
    config.setdefault("http_to_mqtt", []).append(bridge)
    save_config(config)
    return {"status": "added"}

@router.delete("/{name}")
def delete_bridge(name: str):
    config = load_config()
    bridges = config.get("http_to_mqtt", [])
    filtered = [b for b in bridges if b["name"] != name]

    if len(filtered) == len(bridges):
        raise HTTPException(status_code=404, detail="Bridge not found")

    config["http_to_mqtt"] = filtered
    save_config(config)
    return {"status": "deleted"}

@router.put("/{name}")
def update_bridge(name: str, updated_bridge: dict):
    config = load_config()
    bridges = config.get("http_to_mqtt", [])
    for i, b in enumerate(bridges):
        if b["name"] == name:
            bridges[i] = updated_bridge
            config["http_to_mqtt"] = bridges
            save_config(config)
            return {"status": "updated"}
    raise HTTPException(status_code=404, detail="Bridge not found")

@router.delete("/mqtt-to-http/{name}")
def delete_mqtt_to_http(name: str):
    config = load_config()
    bridges = config.get("mqtt_to_http", [])
    filtered = [b for b in bridges if b["name"] != name]
    if len(filtered) == len(bridges):
        raise HTTPException(status_code=404, detail="Bridge not found")
    config["mqtt_to_http"] = filtered
    save_config(config)
    return {"status": "deleted"}

@router.put("/mqtt-to-http/{name}")
def update_mqtt_to_http(name: str, updated_bridge: dict):
    config = load_config()
    bridges = config.get("mqtt_to_http", [])
    for i, b in enumerate(bridges):
        if b["name"] == name:
            bridges[i] = updated_bridge
            config["mqtt_to_http"] = bridges
            save_config(config)
            return {"status": "updated"}
    raise HTTPException(status_code=404, detail="Bridge not found")
