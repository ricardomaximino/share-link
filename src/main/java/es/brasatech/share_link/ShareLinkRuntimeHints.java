package es.brasatech.share_link;

import org.springframework.aot.hint.*;
import org.thymeleaf.spring6.view.AbstractThymeleafView;
import org.thymeleaf.spring6.view.ThymeleafView;
import org.thymeleaf.spring6.view.ThymeleafViewResolver;

public class ShareLinkRuntimeHints implements RuntimeHintsRegistrar {

	@Override
	public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
		// Register Thymeleaf view classes for reflection
		hints.reflection().registerType(ThymeleafView.class, 
				MemberCategory.INVOKE_DECLARED_CONSTRUCTORS, 
				MemberCategory.INVOKE_DECLARED_METHODS);
				
		hints.reflection().registerType(AbstractThymeleafView.class, 
				MemberCategory.INVOKE_DECLARED_CONSTRUCTORS, 
				MemberCategory.INVOKE_DECLARED_METHODS);

		hints.reflection().registerType(ThymeleafViewResolver.class, 
				MemberCategory.INVOKE_DECLARED_CONSTRUCTORS, 
				MemberCategory.INVOKE_DECLARED_METHODS);

		// Register template and static resources
		hints.resources().registerPattern("static/**");
		hints.resources().registerPattern("templates/**");

		// Jackson 3 reflection support for native image
		hints.reflection().registerType(TypeReference.of("tools.jackson.databind.json.JsonMapper"), hint -> {
			hint.withMembers(MemberCategory.INVOKE_PUBLIC_METHODS);
			hint.withMethod("builder", java.util.Collections.emptyList(), ExecutableMode.INVOKE);
		});
		hints.reflection().registerType(TypeReference.of("tools.jackson.databind.ObjectMapper"), MemberCategory.INVOKE_PUBLIC_METHODS);
	}
}
