
import paho.mqtt.client as mqtt
import json



def pub(topic_str, message_str):
    mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    mqtt_client.connect("70.12.246.24", 1883) # 1번
    mqtt_client.loop_start()

    topic_name = topic_str # 2번
    message = json.dumps(message_str)

    mqtt_client.publish(topic = topic_name, payload = message) # 3번
    mqtt_client.loop_stop()
    mqtt_client.disconnect()


#jsonData = {"temperature":36.5,
#            "weight":20}

#pub("test",jsonData)

