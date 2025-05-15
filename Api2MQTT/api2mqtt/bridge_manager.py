import asyncio
from api2mqtt.config import load_config
from api2mqtt.http_client import poll_http_and_publish
from api2mqtt.mqtt_client import mqtt_client

async def start_bridges():
    config = load_config()
    tasks = []

    for bridge in config.get("http_to_mqtt", []):
        tasks.append(asyncio.create_task(poll_http_and_publish(bridge, mqtt_client)))

    return tasks
