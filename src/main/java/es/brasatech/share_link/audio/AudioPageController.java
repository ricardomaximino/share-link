package es.brasatech.share_link.audio;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class AudioPageController {

	@GetMapping("/audio")
	String senderView() {
		return "redirect:/chat?mode=audio";
	}

	@GetMapping("/audio/r/{room}")
	String receiverView(@PathVariable String room) {
		return "redirect:/chat/r/" + room + "?mode=audio";
	}
}
