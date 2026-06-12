package es.brasatech.share_link.audio;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AudioPageController.class)
class AudioPageControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void testSenderView() throws Exception {
		mockMvc.perform(get("/audio"))
				.andExpect(status().isOk())
				.andExpect(view().name("audio/senderView"));
	}

	@Test
	void testReceiverView() throws Exception {
		mockMvc.perform(get("/audio/r/test-room"))
				.andExpect(status().isOk())
				.andExpect(model().attribute("room", "test-room"))
				.andExpect(view().name("audio/receiverView"));
	}
}
