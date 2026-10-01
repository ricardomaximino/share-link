/**
 * ShareLink Internationalization (i18n) Engine
 * Supported Locales: en (US), es (ES), pt (BR)
 */
const translations = {
  en: {
    appTitle: "ShareLink",
    appSubtitle: "Secure Peer-to-Peer Calls & Data",
    brandTeams: "Teams",
    brandWhatsApp: "WhatsApp",
    brandZoom: "Zoom",
    statusIdle: "Idle",
    statusConnecting: "Connecting...",
    statusWaiting: "Waiting for guest...",
    statusJoining: "Joining call...",
    statusActive: "Call Active",
    statusDisconnected: "Disconnected",
    statusExpired: "Expired",
    setupHostTitle: "Start a Chat Link",
    setupHostSubtitle: "Set up your camera and microphone, then share the secure peer-to-peer link to begin your call.",
    setupGuestTitle: "Join Chat",
    setupGuestSubtitle: "Set up your camera and microphone, then join the call hosted by the link owner.",
    cameraOff: "Camera is off",
    muteMic: "Mute Microphone",
    unmuteMic: "Unmute Microphone",
    turnCamOff: "Turn Camera Off",
    turnCamOn: "Turn Camera On",
    btnStartHost: "Create Chat Link",
    btnStartGuest: "Join Meeting",
    copyLink: "Copy Link",
    copied: "Copied!",
    shareBtn: "Share",
    qrBtn: "QR Code",
    qrTitle: "Scan QR Code",
    qrSubtitle: "Scan with your phone to join this call instantly:",
    toastCopied: "Link copied to clipboard!",
    modeAudioOnly: "Audio Only Mode",
    modeVideoOnly: "Video Mode",
    toggleMic: "Toggle Mic",
    toggleCam: "Toggle Camera",
    toggleChat: "Toggle Chat",
    leaveCall: "Leave Call",
    meetingChat: "Meeting Chat",
    typeMessage: "Type a message...",
    attachFile: "Attach file",
    youHost: "You (Host)",
    youGuest: "You (Guest)",
    host: "Host",
    guest: "Guest",
    inviteBanner: "Share the link below to invite someone:",
    guestJoined: "Guest joined the call.",
    participantLeft: "Participant left. Chat room closed.",
    inactivityExpired: "Chat room closed due to inactivity (no guest joined within 10 minutes).",
    sendingFile: "Sending {filename} directly from this browser...",
    receivingFile: "Receiving {filename}...",
    fileDone: "Received {filename}. Link expired.",
    saveFile: "Save {filename}",
    themeLabel: "Theme:",
    langLabel: "Language:"
  },
  es: {
    appTitle: "ShareLink",
    appSubtitle: "Llamadas y Datos P2P Seguros",
    brandTeams: "Teams",
    brandWhatsApp: "WhatsApp",
    brandZoom: "Zoom",
    statusIdle: "En espera",
    statusConnecting: "Conectando...",
    statusWaiting: "Esperando al invitado...",
    statusJoining: "Entrando a la llamada...",
    statusActive: "Llamada activa",
    statusDisconnected: "Desconectado",
    statusExpired: "Expirado",
    setupHostTitle: "Iniciar un enlace de chat",
    setupHostSubtitle: "Configura tu cámara y micrófono, luego comparte el enlace seguro punto a punto para iniciar la llamada.",
    setupGuestTitle: "Unirse al chat",
    setupGuestSubtitle: "Configura tu cámara y micrófono, luego únete a la llamada creada por el anfitrión.",
    cameraOff: "Cámara apagada",
    muteMic: "Silenciar micrófono",
    unmuteMic: "Activar micrófono",
    turnCamOff: "Apagar cámara",
    turnCamOn: "Encender cámara",
    btnStartHost: "Crear enlace de chat",
    btnStartGuest: "Unirse a la reunión",
    copyLink: "Copiar enlace",
    copied: "¡Copiado!",
    shareBtn: "Compartir",
    qrBtn: "Código QR",
    qrTitle: "Escanear código QR",
    qrSubtitle: "Escanea con tu teléfono para unirte a esta llamada al instante:",
    toastCopied: "¡Enlace copiado al portapapeles!",
    modeAudioOnly: "Modo solo audio",
    modeVideoOnly: "Modo video",
    toggleMic: "Alternar micrófono",
    toggleCam: "Alternar cámara",
    toggleChat: "Abrir/Cerrar chat",
    leaveCall: "Salir de la llamada",
    meetingChat: "Chat de la reunión",
    typeMessage: "Escribe un mensaje...",
    attachFile: "Adjuntar archivo",
    youHost: "Tú (Anfitrión)",
    youGuest: "Tú (Invitado)",
    host: "Anfitrión",
    guest: "Invitado",
    inviteBanner: "Comparte este enlace para invitar a alguien:",
    guestJoined: "El invitado se ha unido a la llamada.",
    participantLeft: "El participante ha salido. Sala cerrada.",
    inactivityExpired: "Sala cerrada por inactividad (ningún invitado se unió en 10 minutos).",
    sendingFile: "Enviando {filename} directamente desde este navegador...",
    receivingFile: "Recibiendo {filename}...",
    fileDone: "Recibido {filename}. Enlace finalizado.",
    saveFile: "Guardar {filename}",
    themeLabel: "Tema:",
    langLabel: "Idioma:"
  },
  pt: {
    appTitle: "ShareLink",
    appSubtitle: "Chamadas e Dados P2P Seguros",
    brandTeams: "Teams",
    brandWhatsApp: "WhatsApp",
    brandZoom: "Zoom",
    statusIdle: "Inativo",
    statusConnecting: "Conectando...",
    statusWaiting: "Aguardando convidado...",
    statusJoining: "Entrando na chamada...",
    statusActive: "Chamada ativa",
    statusDisconnected: "Desconectado",
    statusExpired: "Expirado",
    setupHostTitle: "Iniciar um link de chat",
    setupHostSubtitle: "Configure sua câmera e microfone e compartilhe o link seguro ponto a ponto para começar a chamada.",
    setupGuestTitle: "Entrar no chat",
    setupGuestSubtitle: "Configure sua câmera e microfone e entre na chamada criada pelo anfitrião.",
    cameraOff: "Câmera desligada",
    muteMic: "Silenciar microfone",
    unmuteMic: "Ativar microfone",
    turnCamOff: "Desligar câmera",
    turnCamOn: "Ligar câmera",
    btnStartHost: "Criar link de chat",
    btnStartGuest: "Entrar na reunião",
    copyLink: "Copiar link",
    copied: "Copiado!",
    shareBtn: "Compartilhar",
    qrBtn: "Código QR",
    qrTitle: "Escanear Código QR",
    qrSubtitle: "Escaneie com seu celular para entrar na chamada instantaneamente:",
    toastCopied: "Link copiado para a área de transferência!",
    modeAudioOnly: "Modo apenas áudio",
    modeVideoOnly: "Modo vídeo",
    toggleMic: "Alternar microfone",
    toggleCam: "Alternar câmera",
    toggleChat: "Alternar chat",
    leaveCall: "Sair da chamada",
    meetingChat: "Chat da reunião",
    typeMessage: "Digite uma mensagem...",
    attachFile: "Anexar arquivo",
    youHost: "Você (Anfitrião)",
    youGuest: "Você (Convidado)",
    host: "Anfitrião",
    guest: "Convidado",
    inviteBanner: "Compartilhe o link abaixo para convidar alguém:",
    guestJoined: "O convidado entrou na chamada.",
    participantLeft: "Participante saiu. Sala encerrada.",
    inactivityExpired: "Sala encerrada por inatividade (nenhum convidado entrou em 10 minutos).",
    sendingFile: "Enviando {filename} diretamente deste navegador...",
    receivingFile: "Recebendo {filename}...",
    fileDone: "Recebido {filename}. Link expirado.",
    saveFile: "Salvar {filename}",
    themeLabel: "Tema:",
    langLabel: "Idioma:"
  }
};

let currentLang = "en";

function detectLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  const paramLang = urlParams.get("lang");
  if (paramLang && translations[paramLang]) {
    return paramLang;
  }
  const savedLang = localStorage.getItem("sharelink_lang");
  if (savedLang && translations[savedLang]) {
    return savedLang;
  }
  const browserLang = (navigator.language || navigator.userLanguage || "en").toLowerCase();
  if (browserLang.startsWith("es")) return "es";
  if (browserLang.startsWith("pt")) return "pt";
  return "en";
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem("sharelink_lang", lang);
  applyTranslations();
  const select = document.querySelector("#lang-select");
  if (select && select.value !== lang) {
    select.value = lang;
  }
}

function t(key, params = {}) {
  const dict = translations[currentLang] || translations.en;
  let text = dict[key] || translations.en[key] || key;
  for (const [k, v] of Object.entries(params)) {
    text = text.replace(new RegExp(`\\{${k}\\}`, "g"), v);
  }
  return text;
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.setAttribute("placeholder", t(key));
  });
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.getAttribute("data-i18n-title");
    el.setAttribute("title", t(key));
  });
}

// Initialise language
document.addEventListener("DOMContentLoaded", () => {
  currentLang = detectLanguage();
  applyTranslations();
  const select = document.querySelector("#lang-select");
  if (select) {
    select.value = currentLang;
    select.addEventListener("change", (e) => setLanguage(e.target.value));
  }
});
