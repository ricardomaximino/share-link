package es.brasatech.share_link.chat;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class ChatPageController {

	@GetMapping("/chat")
	String senderView() {
		return "chat/senderView";
	}

	@GetMapping("/chat/r/{room}")
	String receiverView(@PathVariable String room, Model model) {
		model.addAttribute("room", room);
		return "chat/receiverView";
	}
}
