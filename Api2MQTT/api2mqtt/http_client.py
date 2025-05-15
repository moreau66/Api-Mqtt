import httpx
import asyncio

async def poll_http_and_publish(bridge, mqtt_client):
    while True:
        url = bridge["url"].format(**bridge["params"])
        try:
            response = await httpx.get(url)
            mqtt_client.publish(bridge["mqtt_topic"], response.text)
        except Exception as e:
            print(f"HTTP polling error: {e}")
        await asyncio.sleep(bridge["interval"])
