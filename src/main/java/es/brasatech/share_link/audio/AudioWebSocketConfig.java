package es.brasatech.share_link.audio;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
public class AudioWebSocketConfig implements WebSocketConfigurer {
	private final AudioSignalHandler signalHandler;

	public AudioWebSocketConfig(AudioSignalHandler signalHandler) {
		this.signalHandler = signalHandler;
	}

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(signalHandler, "/audio/signal");
	}
}
