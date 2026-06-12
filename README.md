# Share Link

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

## Planned Modules

These examples are documented here but intentionally not implemented yet.

1. Chat link

   This will be the final and richest sample. It should behave like a small Teams-style call where both sides can share webcam and microphone, exchange text messages, and send files. Unlike the one-time data link, the chat room should exist until one participant closes the connection.
