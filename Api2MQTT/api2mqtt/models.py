from pydantic import BaseModel
from typing import Dict

class HTTPToMQTTBridge(BaseModel):
    name: str
    url: str
    method: str
    interval: int
    mqtt_topic: str
    params: Dict[str, str]

class MQTTToHTTPBridge(BaseModel):
    name: str
    topic: str
    url: str
    method: str
    payload_mapping: str
    params: Dict[str, str]
