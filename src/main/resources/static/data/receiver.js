const room = window.shareLinkRoom;
const status = document.querySelector("#status");
const download = document.querySelector("#download");
const socket = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/data/signal?role=receiver&room=${room}`);
let pc = new RTCPeerConnection();
let meta;
let received = 0;
let chunks = [];

pc.onicecandidate = event => {
  if (event.candidate) send({ type: "ice", candidate: event.candidate });
};

pc.ondatachannel = event => {
  const channel = event.channel;
  channel.binaryType = "arraybuffer";
  channel.onmessage = event => receive(event.data);
};

socket.onmessage = async event => {
  const message = JSON.parse(event.data);
  if (message.type === "offer") {
    status.textContent = "Direct connection offer received. Answering...";
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
  }
};

function receive(data) {
  if (!meta) {
    meta = JSON.parse(data);
    status.textContent = `Receiving ${meta.name}...`;
    return;
  }
  if (data === "DONE") {
    const blob = new Blob(chunks, { type: meta.type });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = meta.name;
    a.textContent = `Save ${meta.name}`;
    download.replaceChildren(a);
    status.textContent = "Received. This link is now expired.";
    send({ type: "download-complete" });
    return;
  }
  chunks.push(data);
  received += data.byteLength;
  status.textContent = `Received ${received} of ${meta.size} bytes`;
}

function send(message) {
  socket.send(JSON.stringify(message));
}
