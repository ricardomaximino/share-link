package es.brasatech.share_link;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class ShareLinkE2ETests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void testDataEndpoints() throws Exception {
		// Test redirect from root to /data
		mockMvc.perform(get("/"))
				.andExpect(status().is3xxRedirection())
				.andExpect(redirectedUrl("/data"));

		// Test /data view
		mockMvc.perform(get("/data"))
				.andExpect(status().isOk())
				.andExpect(view().name("data/senderView"));

		// Test /data/r/{room} view
		mockMvc.perform(get("/data/r/test-data-room"))
				.andExpect(status().isOk())
				.andExpect(model().attribute("room", "test-data-room"))
				.andExpect(view().name("data/receiverView"));
	}

	@Test
	void testVideoEndpoints() throws Exception {
		// Test /video view
		mockMvc.perform(get("/video"))
				.andExpect(status().isOk())
				.andExpect(view().name("video/senderView"));

		// Test /video/r/{room} view
		mockMvc.perform(get("/video/r/test-video-room"))
				.andExpect(status().isOk())
				.andExpect(model().attribute("room", "test-video-room"))
				.andExpect(view().name("video/receiverView"));
	}

	@Test
	void testAudioEndpoints() throws Exception {
		// Test /audio view
		mockMvc.perform(get("/audio"))
				.andExpect(status().isOk())
				.andExpect(view().name("audio/senderView"));

		// Test /audio/r/{room} view
		mockMvc.perform(get("/audio/r/test-audio-room"))
				.andExpect(status().isOk())
				.andExpect(model().attribute("room", "test-audio-room"))
				.andExpect(view().name("audio/receiverView"));
	}

	@Test
	void testChatEndpoints() throws Exception {
		// Test /chat view
		mockMvc.perform(get("/chat"))
				.andExpect(status().isOk())
				.andExpect(view().name("chat/senderView"));

		// Test /chat/r/{room} view
		mockMvc.perform(get("/chat/r/test-chat-room"))
				.andExpect(status().isOk())
				.andExpect(model().attribute("room", "test-chat-room"))
				.andExpect(view().name("chat/receiverView"));
	}
}
