package es.brasatech.share_link.video;

import org.junit.jupiter.api.Test;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class VideoSignalHandlerTests {

	@Test
	void ignoresCloseForSessionThatWasNotRegisteredInARoom() {
		VideoSignalHandler handler = new VideoSignalHandler();
		WebSocketSession session = mock(WebSocketSession.class);
		when(session.getId()).thenReturn("not-registered");

		assertDoesNotThrow(() -> handler.afterConnectionClosed(session, CloseStatus.NORMAL));
	}
}
