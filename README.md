# WebSocket Chat Vue Client

This is a web client that connects to a WebSocket chat server at `http://localhost:8080`.

## About
A basic Vue webapp to verify the WebSocket server is working correctly.

It uses Pinia for state management, with the majority of WebSocket client logic living in `src/stores/messaging.ts`.

User credentials are seeded by the WebSocket chat server.

## Setup
Install required dependencies
```
npm install
```

Run the client with hot-reloading
```
npm run dev
```

This will open the client at http://localhost:5173