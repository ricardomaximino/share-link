// Page elements
const setupScreen = document.querySelector("#setup-screen");
const meetingScreen = document.querySelector("#meeting-screen");
const previewVideo = document.querySelector("#preview-video");
const previewPlaceholder = document.querySelector("#preview-placeholder");
const localVideo = document.querySelector("#local-video");
const localAvatar = document.querySelector("#local-avatar");
const remoteVideo = document.querySelector("#remote-video");
const remoteAvatar = document.querySelector("#remote-avatar");
const remoteVideoCard = document.querySelector("#remote-video-card");
const videoGrid = document.querySelector("#video-grid");

const btnStart = document.querySelector("#btn-start");
const btnCopyLink = document.querySelector("#btn-copy-link");
const roomLink = document.querySelector("#room-link");
const linkSharingBox = document.querySelector("#link-sharing-box");

// Media controls
const toggleMicSetup = document.querySelector("#toggle-mic-setup");
const toggleCamSetup = document.querySelector("#toggle-cam-setup");
const ctrlMic = document.querySelector("#ctrl-mic");
const ctrlCam = document.querySelector("#ctrl-cam");
const ctrlChat = document.querySelector("#ctrl-chat");
const ctrlLeave = document.querySelector("#ctrl-leave");

// Status
const statusDot = document.querySelector("#status-dot");
const statusText = document.querySelector("#status-text");

// Chat Panel elements
const chatPanel = document.querySelector("#chat-panel");
const btnCloseChat = document.querySelector("#btn-close-chat");
const chatMessages = document.querySelector("#chat-messages");
const chatInputText = document.querySelector("#chat-input-text");
const btnSendMessage = document.querySelector("#btn-send-message");
const btnAttach = document.querySelector("#btn-attach");
const fileInputRaw = document.querySelector("#file-input-raw");
const fileProgressContainer = document.querySelector("#file-progress-container");
const fileProgressLabel = document.querySelector("#file-progress-label");
const fileProgressPct = document.querySelector("#file-progress-pct");
const fileProgressBar = document.querySelector("#file-progress-bar");
const chatShareUrl = document.querySelector("#chat-share-url");

// State
const role = window.shareLinkRole; // "sender" or "receiver"
let room = window.shareLinkRoom;
let socket;
let pc;
let localStream;
let chatChannel;
let fileChannel;

let micEnabled = true;
let camEnabled = true;
let isChatOpen = true;

// Incoming file state
let incomingFileMeta = null;
let incomingFileChunks = [];
let incomingFileReceivedBytes = 0;
let currentIncomingCardId = null;

// Initial setup
async function initSetup() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    previewVideo.srcObject = localStream;
    localVideo.srcObject = localStream;
  } catch (err) {
    console.error("Camera or microphone access denied:", err);
    // Try audio only
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      camEnabled = false;
      updateCamUI(false, true);
    } catch (err2) {
      console.error("Audio access denied as well:", err2);
      alert("Please allow camera and microphone access to use Chat Link.");
    }
  }
}

// Setup buttons logic
toggleMicSetup.onclick = () => {
  micEnabled = !micEnabled;
  updateMicUI(micEnabled, true);
};

toggleCamSetup.onclick = () => {
  camEnabled = !camEnabled;
  updateCamUI(camEnabled, true);
};

function updateMicUI(enabled, isSetup = false) {
  if (localStream) {
    localStream.getAudioTracks().forEach(track => track.enabled = enabled);
  }
  const btns = isSetup ? [toggleMicSetup] : [toggleMicSetup, ctrlMic];
  btns.forEach(btn => {
    if (btn) {
      if (enabled) {
        btn.classList.add("active");
        btn.classList.remove("danger");
        btn.innerHTML = "🎤";
      } else {
        btn.classList.remove("active");
        btn.classList.add("danger");
        btn.innerHTML = "🎙️"; // crossed mic
      }
    }
  });
}

function updateCamUI(enabled, isSetup = false) {
  if (localStream) {
    localStream.getVideoTracks().forEach(track => track.enabled = enabled);
  }
  
  // Show/hide placeholders
  if (isSetup) {
    previewVideo.style.display = enabled ? "block" : "none";
    previewPlaceholder.style.display = enabled ? "none" : "flex";
  } else {
    localVideo.style.display = enabled ? "block" : "none";
    localAvatar.style.display = enabled ? "none" : "flex";
  }

  const btns = isSetup ? [toggleCamSetup] : [toggleCamSetup, ctrlCam];
  btns.forEach(btn => {
    if (btn) {
      if (enabled) {
        btn.classList.add("active");
        btn.classList.remove("danger");
        btn.innerHTML = "📷";
      } else {
        btn.classList.remove("active");
        btn.classList.add("danger");
        btn.innerHTML = "📹"; // crossed cam
      }
    }
  });
}

// Copy link logic
if (btnCopyLink) {
  btnCopyLink.onclick = () => {
    roomLink.select();
    navigator.clipboard.writeText(roomLink.value);
    btnCopyLink.textContent = "Copied!";
    setTimeout(() => {
      btnCopyLink.textContent = "Copy Link";
    }, 2000);
  };
}

// Meeting toggle actions
ctrlMic.onclick = () => {
  micEnabled = !micEnabled;
  updateMicUI(micEnabled);
};

ctrlCam.onclick = () => {
  camEnabled = !camEnabled;
  updateCamUI(camEnabled);
};

ctrlChat.onclick = () => {
  isChatOpen = !isChatOpen;
  if (isChatOpen) {
    chatPanel.classList.remove("collapsed");
    ctrlChat.classList.add("active");
  } else {
    chatPanel.classList.add("collapsed");
    ctrlChat.classList.remove("active");
  }
};

btnCloseChat.onclick = () => {
  isChatOpen = false;
  chatPanel.classList.add("collapsed");
  ctrlChat.classList.remove("active");
};

ctrlLeave.onclick = () => {
  leaveCall();
};

function leaveCall() {
  if (socket) socket.close();
  if (pc) pc.close();
  if (localStream) {
    localStream.getTracks().forEach(t => t.stop());
  }
  location.href = "/chat";
}

// Start flow
btnStart.onclick = async () => {
  if (role === "sender") {
    room = crypto.randomUUID();
    const url = `${location.origin}/chat/r/${room}`;
    roomLink.value = url;
    if (chatShareUrl) chatShareUrl.textContent = url;
    linkSharingBox.style.display = "flex";
    btnStart.style.display = "none";
    
    // Now establish WS connection and wait for receiver
    connectWS();
  } else {
    // For guest, immediately connect
    connectWS();
  }
};

function connectWS() {
  statusDot.className = "status-dot connecting";
  statusText.textContent = role === "sender" ? "Waiting for guest..." : "Joining call...";

  socket = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/chat/signal?role=${role}&room=${room}`);

  socket.onmessage = async event => {
    const msg = JSON.parse(event.data);
    
    if (msg.type === "receiver-joined") {
      statusDot.className = "status-dot";
      statusText.textContent = "Call Active";
      
      // Enter meeting UI
      setupScreen.style.display = "none";
      meetingScreen.style.display = "flex";
      updateMicUI(micEnabled);
      updateCamUI(camEnabled);
      
      // Create Peer Connection
      await initPeer();
    }
    else if (msg.type === "offer") {
      statusDot.className = "status-dot";
      statusText.textContent = "Call Active";
      
      setupScreen.style.display = "none";
      meetingScreen.style.display = "flex";
      updateMicUI(micEnabled);
      updateCamUI(camEnabled);

      await initPeer();
      await pc.setRemoteDescription(msg.offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      sendSignal({ type: "answer", answer });
    }
    else if (msg.type === "answer") {
      await pc.setRemoteDescription(msg.answer);
    }
    else if (msg.type === "ice" && msg.candidate) {
      if (pc) await pc.addIceCandidate(msg.candidate);
    }
    else if (msg.type === "expired") {
      appendLog("System", msg.reason, "danger");
      statusDot.className = "status-dot idle";
      statusText.textContent = "Disconnected";
      disableInputs();
      if (pc) pc.close();
    }
  };

  socket.onclose = () => {
    statusDot.className = "status-dot idle";
    statusText.textContent = "Disconnected";
    disableInputs();
  };
}

// Initialise WebRTC
async function initPeer() {
  pc = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }
    ]
  });

  // Add tracks
  if (localStream) {
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
  }

  // Handle Remote Track
  pc.ontrack = event => {
    remoteVideo.srcObject = event.streams[0];
    remoteVideoCard.style.display = "flex";
    remoteAvatar.style.display = "none";
    videoGrid.classList.add("two-peers");
    appendLog("System", "Guest joined the video call.", "info");
  };

  pc.onicecandidate = event => {
    if (event.candidate) {
      sendSignal({ type: "ice", candidate: event.candidate });
    }
  };

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === "disconnected" || pc.connectionState === "failed" || pc.connectionState === "closed") {
      remoteVideoCard.style.display = "none";
      videoGrid.classList.remove("two-peers");
      appendLog("System", "Peer disconnected.", "danger");
      statusDot.className = "status-dot idle";
      statusText.textContent = "Peer Disconnected";
      disableInputs();
    }
  };

  if (role === "sender") {
    // Setup Chat Channel
    chatChannel = pc.createDataChannel("chat");
    setupChatChannelHandlers(chatChannel);

    // Setup File Channel
    fileChannel = pc.createDataChannel("file");
    setupFileChannelHandlers(fileChannel);

    // Host creates offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    sendSignal({ type: "offer", offer });
  } else {
    // Guest handles data channels
    pc.ondatachannel = event => {
      const channel = event.channel;
      if (channel.label === "chat") {
        chatChannel = channel;
        setupChatChannelHandlers(chatChannel);
      } else if (channel.label === "file") {
        fileChannel = channel;
        setupFileChannelHandlers(fileChannel);
      }
    };
  }
}

// WebSocket Sender helper
function sendSignal(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}

// Data Channel Handlers
function setupChatChannelHandlers(channel) {
  channel.onopen = () => {
    enableInputs();
    appendLog("System", "Direct P2P Data connection established.", "info");
  };
  channel.onclose = () => {
    disableInputs();
  };
  channel.onmessage = event => {
    const data = JSON.parse(event.data);
    if (data.type === "text") {
      appendMessage(data.sender, data.text, "other", data.time);
    } else if (data.type === "file-meta") {
      handleIncomingFileMeta(data);
    }
  };
}

function setupFileChannelHandlers(channel) {
  channel.binaryType = "arraybuffer";
  channel.onmessage = event => {
    handleIncomingFileChunk(event.data);
  };
}

// Enable inputs when direct connection is up
function enableInputs() {
  chatInputText.removeAttribute("disabled");
  btnSendMessage.removeAttribute("disabled");
  chatInputText.focus();
}

function disableInputs() {
  chatInputText.setAttribute("disabled", "true");
  btnSendMessage.setAttribute("disabled", "true");
}

// Chat UI functions
function appendMessage(sender, text, side = "other", time = null) {
  if (!time) {
    const d = new Date();
    time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  const msgBubble = document.createElement("div");
  msgBubble.className = `message-bubble ${side}`;
  
  const formattedSender = sender === "sender" ? "Host" : "Guest";
  
  msgBubble.innerHTML = `
    <div class="message-meta">${side === 'self' ? 'You' : formattedSender} • ${time}</div>
    <div class="message-content">${escapeHTML(text)}</div>
  `;
  
  chatMessages.appendChild(msgBubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendLog(title, text, type = "info") {
  const logDiv = document.createElement("div");
  logDiv.className = `system-log ${type}`;
  logDiv.innerHTML = `<strong>${title}:</strong> ${escapeHTML(text)}`;
  chatMessages.appendChild(logDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send text message
btnSendMessage.onclick = () => {
  sendMessage();
};

chatInputText.onkeydown = event => {
  if (event.key === "Enter") {
    sendMessage();
  }
};

function sendMessage() {
  const text = chatInputText.value.trim();
  if (!text || !chatChannel || chatChannel.readyState !== "open") return;

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const msg = {
    type: "text",
    sender: role,
    text: text,
    time: time
  };
  
  chatChannel.send(JSON.stringify(msg));
  appendMessage(role, text, "self", time);
  chatInputText.value = "";
}

// File Attachment handling
btnAttach.onclick = () => {
  fileInputRaw.click();
};

fileInputRaw.onchange = () => {
  const file = fileInputRaw.files[0];
  if (!file) return;
  sendFile(file);
};

async function sendFile(file) {
  if (!chatChannel || chatChannel.readyState !== "open" || !fileChannel || fileChannel.readyState !== "open") {
    alert("Connection not ready. Cannot send file.");
    return;
  }

  // Send metadata on the chat channel
  const meta = {
    type: "file-meta",
    name: file.name,
    size: file.size,
    fileType: file.type || "application/octet-stream"
  };
  chatChannel.send(JSON.stringify(meta));

  // Render sending card in self chat
  const cardId = "send-" + Date.now();
  appendFileCard(file.name, file.size, "self", cardId);

  // Transfer binary chunks
  fileProgressContainer.style.display = "block";
  fileProgressLabel.textContent = `Sending ${file.name}...`;

  const chunkSize = 16 * 1024;
  let offset = 0;

  while (offset < file.size) {
    if (fileChannel.readyState !== "open") {
      appendLog("System", "Connection lost during file transfer.", "danger");
      fileProgressContainer.style.display = "none";
      return;
    }
    
    // Manage congestion
    while (fileChannel.bufferedAmount > 1024 * 1024) {
      await new Promise(r => setTimeout(r, 50));
    }

    const chunk = await file.slice(offset, offset + chunkSize).arrayBuffer();
    fileChannel.send(chunk);
    offset += chunk.byteLength;

    const pct = Math.round((offset / file.size) * 100);
    fileProgressPct.textContent = `${pct}%`;
    fileProgressBar.style.width = `${pct}%`;
    
    // Update progress on file card
    const cardProgress = document.getElementById(`pct-${cardId}`);
    if (cardProgress) cardProgress.textContent = `(${pct}%)`;
  }

  fileProgressContainer.style.display = "none";
  fileInputRaw.value = ""; // clear input
  
  // Make card complete
  const cardProgress = document.getElementById(`pct-${cardId}`);
  if (cardProgress) cardProgress.textContent = "Sent";
}

// Receive metadata
function handleIncomingFileMeta(meta) {
  incomingFileMeta = meta;
  incomingFileChunks = [];
  incomingFileReceivedBytes = 0;
  
  currentIncomingCardId = "recv-" + Date.now();
  appendFileCard(meta.name, meta.size, "other", currentIncomingCardId);
}

// Receive binary chunk
function handleIncomingFileChunk(chunk) {
  if (!incomingFileMeta) return;

  incomingFileChunks.push(chunk);
  incomingFileReceivedBytes += chunk.byteLength;

  const pct = Math.round((incomingFileReceivedBytes / incomingFileMeta.size) * 100);
  const cardProgress = document.getElementById(`pct-${currentIncomingCardId}`);
  if (cardProgress) cardProgress.textContent = `(${pct}%)`;

  if (incomingFileReceivedBytes >= incomingFileMeta.size) {
    // Finished receiving!
    const blob = new Blob(incomingFileChunks, { type: incomingFileMeta.type });
    const url = URL.createObjectURL(blob);
    
    // Replace card progress with a clickable download link
    const cardContent = document.getElementById(`content-${currentIncomingCardId}`);
    if (cardContent) {
      cardContent.href = url;
      cardContent.download = incomingFileMeta.name;
      cardContent.classList.add("download-ready");
    }

    if (cardProgress) {
      cardProgress.textContent = "Click to Download";
      cardProgress.style.color = "var(--color-purple-light)";
    }

    // Reset incoming state
    incomingFileMeta = null;
    incomingFileChunks = [];
    incomingFileReceivedBytes = 0;
    currentIncomingCardId = null;
  }
}

// Append a beautiful Teams style file card to chat
function appendFileCard(name, size, side, cardId) {
  const msgBubble = document.createElement("div");
  msgBubble.className = `message-bubble ${side}`;
  
  const formattedSender = role === "sender" ? "Host" : "Guest";
  const displayName = side === 'self' ? 'You' : (formattedSender === "Host" ? "Guest" : "Host");
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sizeStr = formatBytes(size);

  msgBubble.innerHTML = `
    <div class="message-meta">${displayName} • ${time}</div>
    <a href="#" id="content-${cardId}" class="file-card" onclick="if(!this.classList.contains('download-ready')) return false;">
      <div class="file-icon">📎</div>
      <div class="file-info">
        <div class="file-name">${escapeHTML(name)}</div>
        <div class="file-size">${sizeStr} • <span id="pct-${cardId}">0%</span></div>
      </div>
    </a>
  `;

  chatMessages.appendChild(msgBubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Helper formatting utilities
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Start setup
initSetup();
