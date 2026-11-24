# RETROLIGHT 3.0 — EMQX Serverless Edition

Responsive RGB lighting dashboard for the original TTGO / LilyGO T-Display ESP32.

## Included

- Responsive phone, tablet, laptop, and desktop UI
- Dark and light glass themes
- SVG icon system
- Color wheel, HEX entry, palettes, brightness, and speed
- 20 lighting effects and local browser presets
- Optional browser microphone analysis for music-reactive lighting
- MQTT.js connection over secure WebSockets (WSS)
- Automatic reconnect handling
- Separate broker-connected and ESP32-online status

## Your EMQX connection (already filled in)

The Device Settings page is preconfigured with:

```text
WSS URL:  wss://q3762a14.ala.us-east-1.emqxsl.com:8084/mqtt
Topic:    retrolight/room
```

The website asks for the MQTT username and password at runtime. It does **not** store the password in localStorage or embed it in this public GitHub Pages package. The username, URL, and topic preference may be saved in the browser.

Use a dedicated low-privilege MQTT account, not your EMQX administrator login. Anyone who can view the public website can inspect its code, so never hardcode broker passwords or Wi-Fi credentials in `app.js`.

## Publish to GitHub Pages

1. Extract this ZIP.
2. Open the `retrolight3` folder.
3. Upload the contents of that folder (`index.html`, `styles.css`, `app.js`, and `README.md`) to the root of your GitHub Pages repository.
4. In the GitHub repository, open **Settings → Pages**.
5. Choose **Deploy from a branch**, your default branch, and `/ (root)`.
6. Open the published `https://...github.io/...` page.
7. Open **Device Settings**, enter your MQTT username and password, and click **Connect**.

The browser needs internet access to load MQTT.js from the unpkg CDN. Microphone access requires a secure context such as GitHub Pages HTTPS. Audio is analyzed locally; only derived levels (bass, mid, treble, and overall level) are published to the broker, not raw microphone audio.

## MQTT topics and payloads

Topic root:

```text
retrolight/room
```

Website publishes to:

```text
retrolight/room/command
```

Website subscribes to:

```text
retrolight/room/state
```

The ESP32 subscribes to `/command` and publishes retained state to `/state`.

Command examples:

```json
{"type":"power","on":true}
{"type":"brightness","value":75}
{"type":"speed","value":55}
{"type":"effect","id":"aurora"}
{"type":"color","hex":"#8B72FF","r":139,"g":114,"b":255}
{"type":"musicMode","mode":"spectrum"}
{"type":"music","mode":"spectrum","bass":42,"mid":31,"treble":18,"level":33}
{"type":"music","mode":"off","bass":0,"mid":0,"treble":0,"level":0}
```

State messages include `online`, `power`, `brightness`, `speed`, `effect`, `color`, `musicMode`, and the ESP32's local IP address.

## Broker authorization recommendation

In EMQX, open **Access Control → Client Authorization**. Add a **Username** authorization rule for the MQTT account:

- Topic: `retrolight/room/#`
- Action: **Publish and Subscribe**
- Permission: **Allow**

This limits the account to RETROLIGHT's command/state topic subtree. Do not use an administrator account in the website.

## Offline behavior

The dashboard remains usable in Preview mode without a broker. The ESP32's built-in lighting effects and two onboard buttons run locally even when Wi-Fi, the internet, or the MQTT broker is unavailable. Phone/laptop control requires a working broker connection.

## Local preview

You may open `index.html` directly to explore most of the interface. For microphone access, use GitHub Pages HTTPS or a local server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Connection details

- Browser MQTT uses EMQX Serverless WSS port `8084` and path `/mqtt`.
- ESP32 MQTT uses MQTTS port `8883` with TLS certificate verification enabled.
- Both devices must use the same topic root and valid EMQX credentials.
- Presets are stored only in the current browser and are not synchronized between devices.
- The firmware is designed for a regular analog RGB strip controlled through three MOSFET channels. It cannot control individual pixels on addressable LED strips.
