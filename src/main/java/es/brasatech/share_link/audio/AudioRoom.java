package es.brasatech.share_link.audio;

import org.springframework.web.socket.WebSocketSession;

class AudioRoom {
	private WebSocketSession sender;
	private WebSocketSession receiver;

	WebSocketSession getSender() {
		return sender;
	}

	void setSender(WebSocketSession sender) {
		this.sender = sender;
	}

	WebSocketSession getReceiver() {
		return receiver;
	}

	void setReceiver(WebSocketSession receiver) {
		this.receiver = receiver;
	}
}
