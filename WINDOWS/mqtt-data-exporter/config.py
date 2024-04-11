# MQTT-DATA-EXPORTER
# Read messages from devices and expose to Prometheus as gauges

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

import os

# listening port
exporterPort = 9021

# seconds before reconnection
reconnectTime = int(os.getenv("EXPOTIMEOUT", "60"))

mqttCreds = { 
    "hostname": os.getenv("MQTTHOST","mqtt"), 
    "port": int(os.getenv("MQTTPORT", "1883")),
    "auth": { "username":os.getenv("MQTTUSER","mqtt"), "password":os.getenv("MQTTPASS","") }
}

