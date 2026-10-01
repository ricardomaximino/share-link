const create = document.querySelector("#create");
const link = document.querySelector("#link");
const btnCopy = document.querySelector("#btn-copy-link");
const status = document.querySelector("#status");
const level = document.querySelector("#level");
let socket;
let pc;
let localStream;
let audioContext;
let analyser;
let meterFrame;
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
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  } catch (error) {
    status.textContent = `Could not open microphone: ${error.message}`;
    return;
  }

  startMeter(localStream);
  const room = crypto.randomUUID();
  link.value = `${location.origin}/audio/r/${room}`;
  if (btnCopy) {
    btnCopy.style.display = "inline-block";
  }
  status.textContent = "Microphone is ready. Link is alive while this tab stays open.";
  socket = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/audio/signal?role=sender&room=${room}`);

  let inactivityTimer = setTimeout(() => {
    status.textContent = "Link expired due to inactivity (no receiver joined within 10 minutes).";
    stopLocalStream();
    if (pingInterval) clearInterval(pingInterval);
    socket?.close();
  }, 10 * 60 * 1000);

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
      if (inactivityTimer) clearTimeout(inactivityTimer);
      status.textContent = "Receiver joined. Creating direct audio connection...";
      await startPeer();
    }
    if (message.type === "answer") {
      await pc.setRemoteDescription(message.answer);
      status.textContent = "Direct audio connection is live.";
    }
    if (message.type === "ice" && message.candidate) {
      await pc.addIceCandidate(message.candidate);
    }
    if (message.type === "expired") {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      status.textContent = message.reason;
      stopLocalStream();
      if (pingInterval) clearInterval(pingInterval);
      socket.close();
    }
  };

  socket.onclose = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    if (pingInterval) clearInterval(pingInterval);
  };

  window.addEventListener("beforeunload", () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
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
      status.textContent = "Audio connection closed.";
    }
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  send({ type: "offer", offer });
}

function startMeter(stream) {
  audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);
  const data = new Uint8Array(analyser.frequencyBinCount);

  const draw = () => {
    analyser.getByteFrequencyData(data);
    const average = data.reduce((sum, value) => sum + value, 0) / data.length;
    level.style.width = `${Math.min(100, average)}%`;
    meterFrame = requestAnimationFrame(draw);
  };
  draw();
}

function stopLocalStream() {
  localStream?.getTracks().forEach(track => track.stop());
  if (meterFrame) {
    cancelAnimationFrame(meterFrame);
  }
  audioContext?.close();
  level.style.width = "0";
}

function send(message) {
  socket.send(JSON.stringify(message));
}
