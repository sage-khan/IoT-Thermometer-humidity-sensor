# MQTT-DATA-EXPORTER
# Copyright (C) 2018  Vladimir Smagin, http://blindage.org

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

from prometheus_client import start_http_server, Summary, Gauge
import random
import time
import paho.mqtt.subscribe as subscribe
import paho.mqtt.publish as publish
import re
import config

# variable with metrics
metrics = {}

def sub(callback_function, topic, wait=False):
    subscribe.callback(callback_function, topic, hostname=config.mqttCreds["hostname"],
        port=config.mqttCreds["port"],auth=config.mqttCreds["auth"])

def any_message_received(client, userdata, message):
    '''Callback function on_message, catch any message and process it'''
    topic=message.topic
    value = message.payload.decode("utf-8")

    # prepare topic to become key in a dict
    topic = re.sub(r'(\/)', '_', topic).lower()
    topic = re.sub(r'([^A-Za-z0-9_])', '', topic).lower()    

    try:
        # try to float() value
        value = float(value)
        if metrics.get(topic):
            # metric already exists
            pass
        else:
            # create new Gauge metric
            metrics[topic] = Gauge(topic, message.topic)
        metrics[topic].set(value)
        # just for debug
        print("ACCEPTED", message.topic, topic, value)
    except:
        # value is not int or float, ignore

        # just for debug
        print("IGNORED", message.topic, topic, value)

start_http_server(config.exporterPort)

# try to reconnect
while(1):
    try:
        print("Connected to MQTT server")
        sub(any_message_received, "#")
    except:
        time.sleep(config.reconnectTime)
        print("Connection to MQTT server lost")
