const room = window.shareLinkRoom;
const status = document.querySelector("#status");
const remoteAudio = document.querySelector("#remoteAudio");
const socket = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/audio/signal?role=receiver&room=${room}`);
let pc = new RTCPeerConnection();
let remoteStream = new MediaStream();

remoteAudio.srcObject = remoteStream;

pc.ontrack = event => {
  event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
  remoteAudio.play().catch(() => {
    status.textContent = "Audio is ready. Press play if the browser blocked autoplay.";
  });
  status.textContent = "Receiving microphone stream directly from the sender.";
};

pc.onicecandidate = event => {
  if (event.candidate) send({ type: "ice", candidate: event.candidate });
};

pc.onconnectionstatechange = () => {
  if (pc.connectionState === "disconnected" || pc.connectionState === "failed" || pc.connectionState === "closed") {
    status.textContent = "Audio connection closed.";
  }
};

socket.onmessage = async event => {
  const message = JSON.parse(event.data);
  if (message.type === "offer") {
    status.textContent = "Direct audio offer received. Answering...";
    await pc.setRemoteDescription(message.offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    send({ type: "answer", answer });
  }
  if (message.type === "ice" && message.candidate) {
    await pc.addIceCandidate(message.candidate);
  }
  if (message.type === "expired") {
    status.textContent = message.reason;
    socket.close();
  }
};

function send(message) {
  socket.send(JSON.stringify(message));
}
