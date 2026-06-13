package es.brasatech.share_link.video;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
public class VideoWebSocketConfig implements WebSocketConfigurer {
	private final VideoSignalHandler signalHandler;

	public VideoWebSocketConfig(VideoSignalHandler signalHandler) {
		this.signalHandler = signalHandler;
	}

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(signalHandler, "/video/signal").setAllowedOrigins("*");
	}
}
