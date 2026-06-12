package es.brasatech.share_link;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ImportRuntimeHints;

@SpringBootApplication
@ImportRuntimeHints(ShareLinkRuntimeHints.class)
public class ShareLinkApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShareLinkApplication.class, args);
	}
}
