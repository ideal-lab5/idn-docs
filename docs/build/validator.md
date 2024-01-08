---
sidebar_position: 5
---

# Run a Validator

> :warning: This is a WIP.

This is a guide on how to setup a full validator node on an ubuntu instance.

This will walk through:
1. Installing dependencies, chain spec, and node  (TODO)
2. Setting up the node as a system service (In progress)
3.  configuring proxies (nginx) and certs (lets encrypt) for the websocket connections (TODO)

Some of this information can apply to any substrate based node, not only etf network nodes.


## Setup system service

``` bash
mkdir /etf
cd /etf
wget https://raw.githubusercontent.com/ideal-lab5/substrate/milestone3/etfTestSpecRaw.json
sudo nano etf.service

```

Then configure the file:

``` bash
[Unit]
Description=ETF Bootstrap Node
After=docker.service
Requires=docker.service

[Service]
TimeoutStartSec=0
ExecStartPre=-/usr/bin/docker stop %n
ExecStartPre=-/usr/bin/docker rm %n
ExecStartPre=/usr/bin/docker pull ideallabs/etf
ExecStart=/usr/bin/docker run --rm -v /home/ubuntu/etf/etfTestSpecRaw.json:/data/chainspec.json  -p 9944:9944 -p 30333:30333 -p 9615:9615 ideallabs/etf  --chain=/data/chainspec.json [add your params]

[Install]
WantedBy=multi-user.target
```

Replace the path to the chainspec with the absolute path of wherever you stored the file. Also replace [add your params] with whatever is desired, for example, if you wanted to run a full "Alice" validator exposed as a bootstrap node, you could run with:

``` bash
--alice --unsafe-rpc-external --rpc-cors all \
--node-key 0000000000000000000000000000000000000000000000000000000000000001 \
--listen-addr /ip4/0.0.0.0/tcp/30332 --listen-addr /ip4/0.0.0.0/tcp/30333/ws \
--prometheus-external
```

Store the file as `etf.service` and create a symlink in the systemd service directory and enable the service:

``` bash
cd /etc/systemd/system/
#  create a symlink
sudo ln -s ~/etf/etf.service .
# enable the service
sudo systemctl enable etf.service
```

Then use it as any other system service:
``` bash
sudo systemctl [start | stop | status] etf
```