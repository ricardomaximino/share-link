package es.brasatech.share_link.data;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class DataPageController {

	@GetMapping("/")
	String home() {
		return "redirect:/data";
	}

	@GetMapping("/data")
	String senderView() {
		return "data/senderView";
	}

	@GetMapping("/data/r/{room}")
	String receiverView(@PathVariable String room, Model model) {
		model.addAttribute("room", room);
		return "data/receiverView";
	}
}
