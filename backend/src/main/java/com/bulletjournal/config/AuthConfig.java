package com.bulletjournal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "auth")
public class AuthConfig {
	private String defaultUsername;
	private boolean enableDefaultUser;

	public String getDefaultUsername() {
		return defaultUsername;
	}

	public void setDefaultUsername(String defaultUsername) {
		this.defaultUsername = defaultUsername;
	}

	public boolean isEnableDefaultUser() {
		return enableDefaultUser;
	}

	public void setEnableDefaultUser(boolean enableDefaultUser) {
		this.enableDefaultUser = enableDefaultUser;
	}
}
