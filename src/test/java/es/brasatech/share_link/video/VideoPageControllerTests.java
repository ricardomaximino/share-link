package es.brasatech.share_link.video;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(VideoPageController.class)
class VideoPageControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void testSenderView() throws Exception {
		mockMvc.perform(get("/video"))
				.andExpect(status().is3xxRedirection())
				.andExpect(redirectedUrl("/chat?mode=video"));
	}

	@Test
	void testReceiverView() throws Exception {
		mockMvc.perform(get("/video/r/test-room"))
				.andExpect(status().is3xxRedirection())
				.andExpect(redirectedUrl("/chat/r/test-room?mode=video"));
	}
}
