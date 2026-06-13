# Share Link

## Docker:

Linux: 
`
 mvn clean install && mvn -Pnative native:compile && docker build -f docker/Dockerfile --tag ricardomaximino/share-link . && docker push ricardomaximino/share-link:latest
`

This project is a learning playground for temporary peer-to-peer links.

## Current Module: Data

The `data` module demonstrates a one-time file link:

- Java code lives under `es.brasatech.share_link.data`.
- Thymeleaf views live under `src/main/resources/static/templates/data`.
- Static browser assets live under `src/main/resources/static/data`.
- The sender opens `/data`, chooses a file, and gets a `/data/r/{room}` link.
- Spring only coordinates the WebRTC signaling messages through `/data/signal`.
- The file bytes move between browsers over a WebRTC data channel.
- The room expires when the sender leaves or when the receiver confirms the download.

## Current Module: Video

The `video` module demonstrates a temporary one-way webcam link:

- Java code lives under `es.brasatech.share_link.video`.
- Thymeleaf views live under `src/main/resources/static/templates/video`.
- Static browser assets live under `src/main/resources/static/video`.
- The sender opens `/video`, grants webcam access, and gets a `/video/r/{room}` link.
- Spring only coordinates the WebRTC signaling messages through `/video/signal`.
- The webcam stream moves between browsers over WebRTC media tracks.
- The room expires when the sender leaves.

## Current Module: Audio

The `audio` module demonstrates a temporary one-way microphone link:

- Java code lives under `es.brasatech.share_link.audio`.
- Thymeleaf views live under `src/main/resources/static/templates/audio`.
- Static browser assets live under `src/main/resources/static/audio`.
- The sender opens `/audio`, grants microphone access, and gets a `/audio/r/{room}` link.
- Spring only coordinates the WebRTC signaling messages through `/audio/signal`.
- The microphone stream moves between browsers over WebRTC media tracks.
- The room expires when the sender leaves.

## Current Module: Chat

The `chat` module demonstrates a bidirectional chat link with Dark Microsoft Teams aesthetics:

- Java code lives under `es.brasatech.share_link.chat`.
- Thymeleaf views live under `src/main/resources/static/templates/chat`.
- Static browser assets live under `src/main/resources/static/chat`.
- The host opens `/chat`, configures their media, and gets a `/chat/r/{room}` link.
- Spring only coordinates the WebRTC signaling messages through `/chat/signal`.
- Webcams, microphones, text messages, and file transfers move between browsers directly over WebRTC connection tracks and data channels.
- The chat room exists until a participant closes the connection.

## Planned Modules

All planned modules have been implemented.
