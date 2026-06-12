package es.brasatech.share_link.data;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DataPageController.class)
class DataPageControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void testRedirectHome() throws Exception {
		mockMvc.perform(get("/"))
				.andExpect(status().is3xxRedirection())
				.andExpect(redirectedUrl("/data"));
	}

	@Test
	void testSenderView() throws Exception {
		mockMvc.perform(get("/data"))
				.andExpect(status().isOk())
				.andExpect(view().name("data/senderView"));
	}

	@Test
	void testReceiverView() throws Exception {
		mockMvc.perform(get("/data/r/test-room"))
				.andExpect(status().isOk())
				.andExpect(model().attribute("room", "test-room"))
				.andExpect(view().name("data/receiverView"));
	}
}
