const room = window.shareLinkRoom;
const status = document.querySelector("#status");
const remoteVideo = document.querySelector("#remoteVideo");
const socket = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/video/signal?role=receiver&room=${room}`);
let pc = new RTCPeerConnection();
let remoteStream = new MediaStream();

remoteVideo.srcObject = remoteStream;

pc.ontrack = event => {
  event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
  status.textContent = "Receiving webcam stream directly from the sender.";
};

pc.onicecandidate = event => {
  if (event.candidate) send({ type: "ice", candidate: event.candidate });
};

pc.onconnectionstatechange = () => {
  if (pc.connectionState === "disconnected" || pc.connectionState === "failed" || pc.connectionState === "closed") {
    status.textContent = "Video connection closed.";
  }
};

socket.onmessage = async event => {
  const message = JSON.parse(event.data);
  if (message.type === "offer") {
    status.textContent = "Direct video offer received. Answering...";
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
