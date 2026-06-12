package es.brasatech.share_link.video;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.net.URI;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class VideoSignalHandler extends TextWebSocketHandler {
	private final Map<String, VideoRoom> rooms = new ConcurrentHashMap<>();
	private final Map<String, String> sessionRooms = new ConcurrentHashMap<>();

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		Map<String, String> params = queryParams(session.getUri());
		String role = params.get("role");
		String roomId = params.get("room");
		if (roomId == null || role == null) {
			session.close(CloseStatus.BAD_DATA.withReason("Missing room or role"));
			return;
		}

		if ("sender".equals(role)) {
			VideoRoom room = new VideoRoom();
			room.setSender(session);
			rooms.put(roomId, room);
			sessionRooms.put(session.getId(), roomId);
			return;
		}

		if ("receiver".equals(role)) {
			VideoRoom room = rooms.get(roomId);
			if (room == null || room.getSender() == null || room.getReceiver() != null) {
				send(session, "expired", "This video link is not active.");
				session.close();
				return;
			}
			room.setReceiver(session);
			sessionRooms.put(session.getId(), roomId);
			send(room.getSender(), "receiver-joined");
			return;
		}

		session.close(CloseStatus.BAD_DATA.withReason("Unknown role"));
	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage textMessage) throws Exception {
		String roomId = sessionRooms.get(session.getId());
		if (roomId == null) {
			send(session, "expired", "This video link has expired.");
			return;
		}
		VideoRoom room = rooms.get(roomId);
		if (room == null) {
			send(session, "expired", "This video link has expired.");
			return;
		}

		WebSocketSession other = room.getSender() == session ? room.getReceiver() : room.getSender();
		if (other != null && other.isOpen()) {
			other.sendMessage(textMessage);
		}
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		String roomId = sessionRooms.remove(session.getId());
		if (roomId == null) {
			return;
		}
		VideoRoom room = rooms.get(roomId);
		if (room != null && room.getSender() == session) {
			expire(roomId, "Sender left. Video link expired.");
		}
	}

	private void expire(String roomId, String reason) throws IOException {
		VideoRoom room = rooms.remove(roomId);
		if (room == null) {
			return;
		}
		if (room.getSender() != null) {
			sessionRooms.remove(room.getSender().getId());
			send(room.getSender(), "expired", reason);
		}
		if (room.getReceiver() != null) {
			sessionRooms.remove(room.getReceiver().getId());
			send(room.getReceiver(), "expired", reason);
		}
	}

	private void send(WebSocketSession session, String type) throws IOException {
		sendJson(session, "{\"type\":\"" + escapeJson(type) + "\"}");
	}

	private void send(WebSocketSession session, String type, String reason) throws IOException {
		sendJson(session, "{\"type\":\"" + escapeJson(type) + "\",\"reason\":\"" + escapeJson(reason) + "\"}");
	}

	private void sendJson(WebSocketSession session, String json) throws IOException {
		if (session != null && session.isOpen()) {
			session.sendMessage(new TextMessage(json));
		}
	}

	private String escapeJson(String value) {
		return value.replace("\\", "\\\\").replace("\"", "\\\"");
	}

	private Map<String, String> queryParams(URI uri) {
		Map<String, String> params = new ConcurrentHashMap<>();
		if (uri == null || uri.getQuery() == null) {
			return params;
		}
		for (String pair : uri.getQuery().split("&")) {
			String[] parts = pair.split("=", 2);
			if (parts.length == 2) {
				params.put(parts[0], parts[1]);
			}
		}
		return params;
	}
}
