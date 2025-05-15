from fastapi import APIRouter

router = APIRouter()

@router.post("/publish")
def publish_message(topic: str, payload: str):
    from api2mqtt.mqtt_client import mqtt_client
    mqtt_client.publish(topic, payload)
    return {"status": "published"}
