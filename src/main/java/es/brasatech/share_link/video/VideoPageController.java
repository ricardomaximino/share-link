package es.brasatech.share_link.video;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class VideoPageController {

	@GetMapping("/video")
	String senderView() {
		return "video/senderView";
	}

	@GetMapping("/video/r/{room}")
	String receiverView(@PathVariable String room, Model model) {
		model.addAttribute("room", room);
		return "video/receiverView";
	}
}
