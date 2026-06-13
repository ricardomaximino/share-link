package es.brasatech.share_link.chat;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
public class ChatWebSocketConfig implements WebSocketConfigurer {
	private final ChatSignalHandler signalHandler;

	public ChatWebSocketConfig(ChatSignalHandler signalHandler) {
		this.signalHandler = signalHandler;
	}

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(signalHandler, "/chat/signal").setAllowedOrigins("*");
	}
}
