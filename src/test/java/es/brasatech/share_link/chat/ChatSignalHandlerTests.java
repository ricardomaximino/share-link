package es.brasatech.share_link.chat;

import org.junit.jupiter.api.Test;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ChatSignalHandlerTests {

	@Test
	void ignoresCloseForSessionThatWasNotRegisteredInARoom() {
		ChatSignalHandler handler = new ChatSignalHandler();
		WebSocketSession session = mock(WebSocketSession.class);
		when(session.getId()).thenReturn("not-registered");

		assertDoesNotThrow(() -> handler.afterConnectionClosed(session, CloseStatus.NORMAL));
	}
}
