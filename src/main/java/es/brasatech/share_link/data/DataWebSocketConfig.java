package es.brasatech.share_link.data;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class DataWebSocketConfig implements WebSocketConfigurer {
	private final DataSignalHandler signalHandler;

	public DataWebSocketConfig(DataSignalHandler signalHandler) {
		this.signalHandler = signalHandler;
	}

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(signalHandler, "/data/signal");
	}
}
