package es.brasatech.share_link.chat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ChatPageController.class)
class ChatPageControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void testSenderView() throws Exception {
		mockMvc.perform(get("/chat"))
				.andExpect(status().isOk())
				.andExpect(view().name("chat/senderView"));
	}

	@Test
	void testReceiverView() throws Exception {
		mockMvc.perform(get("/chat/r/test-room"))
				.andExpect(status().isOk())
				.andExpect(model().attribute("room", "test-room"))
				.andExpect(view().name("chat/receiverView"));
	}
}
