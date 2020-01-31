package com.bulletjournal.controller.models;

public class User {
	private String name;
	private String thumbnail;
	private String avatar;
	
	public User() {
	}

	public User(String name, String thumbnail, String avatar) {
		this.name = name;
		this.thumbnail = thumbnail;
		this.avatar = avatar;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getThumbnail() {
		return thumbnail;
	}

	public void setThumbnail(String thumbnail) {
		this.thumbnail = thumbnail;
	}

	public String getAvatar() {
		return avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}

}
