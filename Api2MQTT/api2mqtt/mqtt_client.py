import paho.mqtt.client as mqtt

mqtt_client = mqtt.Client()

def start_mqtt():
    mqtt_client.connect("localhost", 1883)
    mqtt_client.loop_start()
