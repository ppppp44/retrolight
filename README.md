# RETROLIGHT 3.0

Responsive smart RGB lighting dashboard for the TTGO T-Display ESP32.

## What's included

- Responsive phone, tablet, laptop, and desktop layouts
- Dark glass and light glass themes
- SVG icon system (no emoji icons)
- Interactive hue ring, saturation and color-intensity controls
- 20-effect library with search and category filters
- Local presets saved in the browser
- Phone/laptop microphone analysis using the Web Audio API
- Optional MQTT-over-WebSocket (WSS) transport for the ESP32
- Preview mode when no controller is connected

## Run locally

You can open `index.html` directly to explore most of the interface. For microphone access, use a secure context such as GitHub Pages HTTPS or `http://localhost`.

A simple local preview server can be started from this folder with:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`. This local server is only for previewing/developing the website; RETROLIGHT does not require a computer to remain running once the site is hosted on GitHub Pages.

## Publish with GitHub Pages

1. Create a GitHub repository for the website.
2. Upload `index.html`, `styles.css`, `app.js`, and this README to the repository root.
3. In repository Settings, open **Pages**.
4. Choose **Deploy from a branch**, select your default branch, and choose `/ (root)`.
5. Open the published HTTPS site on your phone or laptop.

The dashboard stores theme selection and presets locally in that browser. Presets are not automatically synchronized between devices.

## ESP32 connection architecture

The dashboard uses MQTT over secure WebSockets (WSS), so both the browser on GitHub Pages and the ESP32 can connect outward to the same broker. This avoids trying to call an ordinary local HTTP endpoint from an HTTPS GitHub Pages site.

You need an MQTT broker that supports **WSS** for the browser and TLS/MQTT for the ESP32. The broker URL goes in Device Settings, for example:

```text
wss://your-broker-host.example:secure-websocket-port/mqtt
```

The URL above is only a format example, not a working broker address. Enter the exact WSS endpoint provided by your broker.

Suggested topic root:

```text
retrolight/room
```

The browser publishes commands to:

```text
retrolight/room/command
```

The ESP32 publishes state to:

```text
retrolight/room/state
```

The ESP32 firmware should subscribe to the command topic and publish status JSON to the state topic. The web app's command payloads use JSON like:

```json
{"type":"color","hex":"#8B72FF","r":139,"g":114,"b":255,"source":"retrolight-web","ts":1790000000000}
```

Other command types used by the UI are `power`, `brightness`, `effect`, `music`, and `musicMode`. Example payloads:

```json
{"type":"power","on":true}
{"type":"brightness","value":75}
{"type":"effect","id":"aurora"}
{"type":"music","mode":"spectrum","bass":42,"mid":31,"treble":18,"level":33}
```

The ESP32 can publish a state message such as:

```json
{"power":true,"brightness":75,"effect":"aurora","color":"#8B72FF","ip":"192.168.1.42"}
```

The exact broker, credentials, Wi-Fi connection code, and matching ESP32 firmware have **not** been configured in this front-end package yet. The dashboard starts in Preview mode and does not pretend a physical controller is connected.

## Credential safety

- Do not put home Wi-Fi passwords, broker passwords, or private tokens in `app.js` or any file committed to a public GitHub repository.
- Use a dedicated MQTT account with permissions restricted to this device's topic root. Avoid using a broker administrator account in the browser.
- The broker password entered in Device Settings is kept in memory for the current page session and is not written to local storage.
- Microphone audio is analyzed in the browser. The UI sends only derived lighting values (for example, bass/mid/treble levels) to the MQTT command topic; it does not upload raw microphone audio.

## Important implementation note

This is the **website/front-end milestone**. The interface and browser-side behavior are implemented, but the ESP32 firmware still needs to be written to match the MQTT topic and JSON protocol above. Until then, controller actions update the local preview and the connection status remains Offline/Preview.
