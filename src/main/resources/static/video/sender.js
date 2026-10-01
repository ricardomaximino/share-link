const create = document.querySelector("#create");
const link = document.querySelector("#link");
const btnCopy = document.querySelector("#btn-copy-link");
const status = document.querySelector("#status");
const localVideo = document.querySelector("#localVideo");
let socket;
let pc;
let localStream;
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
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  } catch (error) {
    status.textContent = `Could not open webcam: ${error.message}`;
    return;
  }

  localVideo.srcObject = localStream;
  const room = crypto.randomUUID();
  link.value = `${location.origin}/video/r/${room}`;
  if (btnCopy) {
    btnCopy.style.display = "inline-block";
  }
  status.textContent = "Webcam is ready. Link is alive while this tab stays open.";
  socket = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/video/signal?role=sender&room=${room}`);

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
      status.textContent = "Receiver joined. Creating direct video connection...";
      await startPeer();
    }
    if (message.type === "answer") {
      await pc.setRemoteDescription(message.answer);
      status.textContent = "Direct video connection is live.";
    }
    if (message.type === "ice" && message.candidate) {
      await pc.addIceCandidate(message.candidate);
    }
    if (message.type === "expired") {
      status.textContent = message.reason;
      stopLocalStream();
      if (pingInterval) clearInterval(pingInterval);
      socket.close();
    }
  };

  socket.onclose = () => {
    if (pingInterval) clearInterval(pingInterval);
  };

  window.addEventListener("beforeunload", () => {
    if (pingInterval) clearInterval(pingInterval);
    stopLocalStream();
    socket?.close();
  });
};

async function startPeer() {
  pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  });
  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

  pc.onicecandidate = event => {
    if (event.candidate) send({ type: "ice", candidate: event.candidate });
  };
  pc.onconnectionstatechange = () => {
    if (pc.connectionState === "disconnected" || pc.connectionState === "failed" || pc.connectionState === "closed") {
      status.textContent = "Video connection closed.";
    }
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  send({ type: "offer", offer });
}

function stopLocalStream() {
  localStream?.getTracks().forEach(track => track.stop());
}

function send(message) {
  socket.send(JSON.stringify(message));
}
