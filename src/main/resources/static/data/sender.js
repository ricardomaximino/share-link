const fileInput = document.querySelector("#file");
const create = document.querySelector("#create");
const link = document.querySelector("#link");
const btnCopy = document.querySelector("#btn-copy-link");
const status = document.querySelector("#status");
let socket;
let pc;
let channel;
let pingInterval;

if (btnCopy) {
  btnCopy.onclick = () => {
    link.select();
    navigator.clipboard.writeText(link.value);
    btnCopy.textContent = "Copied!";
    setTimeout(() => {
      btnCopy.textContent = "Copy Link";
    }, 2000);
  };
}

create.onclick = async () => {
  const file = fileInput.files[0];
  if (!file) {
    status.textContent = "Choose a file first.";
    return;
  }

  const room = crypto.randomUUID();
  link.value = `${location.origin}/data/r/${room}`;
  if (btnCopy) {
    btnCopy.style.display = "inline-block";
  }
  status.textContent = "Link is alive while this tab stays open. Waiting for one receiver...";
  socket = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/data/signal?role=sender&room=${room}`);

  if (pingInterval) clearInterval(pingInterval);
  pingInterval = setInterval(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "ping" }));
    }
  }, 15000);

  socket.onmessage = async event => {
    const message = JSON.parse(event.data);
    if (message.type === "pong") {
      return;
    }
    if (message.type === "receiver-joined") {
      status.textContent = "Receiver joined. Creating direct connection...";
      await startPeer(file);
    }
    if (message.type === "answer") {
      await pc.setRemoteDescription(message.answer);
    }
    if (message.type === "ice" && message.candidate) {
      await pc.addIceCandidate(message.candidate);
    }
    if (message.type === "expired") {
      status.textContent = message.reason;
      if (pingInterval) clearInterval(pingInterval);
      socket.close();
    }
  };

  socket.onclose = () => {
    if (pingInterval) clearInterval(pingInterval);
  };

  window.addEventListener("beforeunload", () => {
    if (pingInterval) clearInterval(pingInterval);
    socket?.close();
  });
};

async function startPeer(file) {
  pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  });
  channel = pc.createDataChannel("file");

  pc.onicecandidate = event => {
    if (event.candidate) send({ type: "ice", candidate: event.candidate });
  };
  channel.onopen = () => sendFile(file, channel);
  channel.onclose = () => status.textContent = "Connection closed.";

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  send({ type: "offer", offer });
}

async function sendFile(file, channel) {
  status.textContent = `Sending ${file.name} directly from this browser...`;
  channel.send(JSON.stringify({ name: file.name, size: file.size, type: file.type || "application/octet-stream" }));

  const chunkSize = 16 * 1024;
  let offset = 0;
  while (offset < file.size) {
    while (channel.bufferedAmount > 1024 * 1024) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    channel.send(await file.slice(offset, offset + chunkSize).arrayBuffer());
    offset += chunkSize;
    status.textContent = `Sent ${Math.min(offset, file.size)} of ${file.size} bytes`;
  }
  channel.send("DONE");
  status.textContent = "Done. The link will expire when the receiver confirms receipt.";
}

function send(message) {
  socket.send(JSON.stringify(message));
}
