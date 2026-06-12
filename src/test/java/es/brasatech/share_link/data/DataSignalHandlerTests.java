package es.brasatech.share_link.data;

import org.junit.jupiter.api.Test;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class DataSignalHandlerTests {

	@Test
	void ignoresCloseForSessionThatWasNotRegisteredInARoom() {
		DataSignalHandler handler = new DataSignalHandler();
		WebSocketSession session = mock(WebSocketSession.class);
		when(session.getId()).thenReturn("not-registered");

		assertDoesNotThrow(() -> handler.afterConnectionClosed(session, CloseStatus.NORMAL));
	}
}
