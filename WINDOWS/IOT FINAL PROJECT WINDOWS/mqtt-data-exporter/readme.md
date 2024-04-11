# MQTT Data Exporter

This program reads numbers from MQTT bus and exposes to Prometheus as gauge values. Nice tool to monitor sensors.

Example of exposed values:

```
ACCEPTED /device/5C:CF:7F:3D:C3:9F/termo/1/data _device_5ccf7f3dc39f_termo_1_data 13.69
ACCEPTED /device/5C:CF:7F:3D:C3:9F/relay/1/data _device_5ccf7f3dc39f_relay_1_data 0.0
ACCEPTED /device/60:01:94:0D:E5:82/lights/1/data _device_6001940de582_lights_1_data 1.0
ACCEPTED /device/60:01:94:0D:E5:82/RSSI _device_6001940de582_rssi -64.0
IGNORED /hello/A0:20:A6:13:60:0D _hello_a020a613600d termo[1],pressure[1],humidity[1]
IGNORED /device/A0:20:A6:13:60:0D/hostname _device_a020a613600d_hostname modA020A613600D
IGNORED /device/A0:20:A6:13:60:0D/devicename _device_a020a613600d_devicename A0:20:A6:13:60:0D
IGNORED /device/A0:20:A6:13:60:0D/IP _device_a020a613600d_ip 192.168.1.21
```

## Docker

Set variables and run:

```
docker run --name mqttde_container -d \
  -e MQTTHOST=mqtt.server.ru \
  -e MQTTPORT=1883 \
  -e MQTTUSER=bus \
  -e MQTTPASS=myultrapassword \
  -e EXPOTIMEOUT=60 \
  -p 9021:9021 iam21h/mqtt-data-exporter:0.0.1
```

Checkout local port 9021:

`$> curl http://localhost:9021/metrics`

Default values:

- MQTTHOST: mqtt
- MQTTPORT: 1883
- MQTTUSER: mqtt
- MQTTPASS:
- EXPOTIMEOUT: 60

# License

MQTT-DATA-EXPORTER
Copyright (C) 2018-2019  Vladimir Smagin, http://blindage.org

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

# Questions?

If you have any questions mail me to 21h@blindage.org.
