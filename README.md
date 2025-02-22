# Network Tester

Network Tester is an Electron application that monitors network connectivity by pinging a target IP address (default: 8.8.8.8) and displays the status and latency via a system tray icon and a React-based user interface. It also provides a dedicated window to update the target IP, and the IP value is persisted between sessions using electron-store.

## Features

* **Network Monitoring**: Ping a configurable target IP to check for connectivity and measure latency.

* **Tray Icon Updates:** The tray icon updates its color based on connection status (e.g., green for good connectivity, red for issues).

* **React-based UI:** A small, always-on-top window shows the current connection status and latency, with a toggleable dark/light mode.

* **IP Input Window:** A separate React-powered window allows the user to update the target IP.

* **Persistent Settings:** The target IP is saved between sessions using electron-store.

* **Cross-platform Packaging:** Built using Electron Forge with Webpack for easy packaging and distribution.

## Folder Structure

```graphql
my-electron-app/
├── forge.config.js
├── package.json
├── webpack.main.config.js
├── webpack.renderer.config.js
└── src/
    ├── main/                  # Main process code
    │   ├── index.js           # App entry point
    │   ├── windows.js         # Window creation functions
    │   ├── tray.js            # Tray setup and update functions
    │   ├── ping.js            # Network ping functionality and persistence
    │   └── ipc.js             # IPC channel setup
    ├── renderer/              # Renderer process code
    │   ├── index.html         # Main UI HTML file
    │   ├── renderer.jsx       # Main React entry
    │   ├── App.js             # Main React component
    │   ├── ipInput.html       # HTML for the IP input window
    │   └── ipInput.jsx        # React component for IP input
    ├── shared/                # Shared utilities and assets
    │   ├── imgData.js         # Images and icon data
    │   └── utils.js           # Utility functions
    └── preload.js             # Preload script (exposes API to renderer)
```

## Installation

1. Clone the Repository:

```bash
git clone <repository-url>
cd my-electron-app
```

2. Install Dependencies:

```bash
npm install
```

3. Usage
#### Running in Development Mode

Start the application with Electron Forge:

```bash
npm start
```

This command will compile the code using Webpack and open the main window. Any changes you make will be reloaded.

### Packaging for Distribution

To package the application:

```bash
npm run package
```

To create distributable installers for your target platforms:

```bash
npm run make
```

## Configuring the Target IP

* **Default IP:** The application uses 8.8.8.8 as the default target IP.

* **Updating the IP:** Use the tray menu option "Set Target IP" to open the IP input window. After entering a new IP and saving, the app will use this value. The setting is saved using electron-store and will persist across sessions.

## Webpack & Electron Forge Configuration

* **Main Process Entry:** The main process entry point is defined in webpack.main.config.js as ./src/main/main.js.

* **Renderer Process:** Two entry points are provided:
    Main Window: Uses ./src/renderer/index.html and ./src/renderer/renderer.jsx.
    IP Input Window: Uses ./src/renderer/ipInput.html and ./src/renderer/ipInput.jsx.

* **Preload Script:** Both renderer processes use a preload script located at ./src/preload.js, which is resolved with an absolute path in the Forge configuration.

## Dependencies

* **Electron –** Desktop application framework.
* **Electron Forge –** Tool for packaging, building, and distributing Electron apps.
* **Webpack –** Bundler for main and renderer processes.
* **React –** Library for building the UI.
* **electron-store –** Lightweight key-value storage for persisting settings.
* **ping –** Utility for checking network connectivity.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for improvements, bug fixes, or new features.

## License

This project is licensed under the MIT License.