package es.brasatech.share_link.data;

import org.springframework.web.socket.WebSocketSession;

class DataRoom {
	private WebSocketSession sender;
	private WebSocketSession receiver;
	private boolean used;

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

	boolean isUsed() {
		return used;
	}

	void markUsed() {
		this.used = true;
	}
}
