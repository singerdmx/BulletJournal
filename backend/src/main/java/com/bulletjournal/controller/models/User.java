package com.bulletjournal.controller.models;

public class User {
    private String name;
    private String thumbnail;
    private String avatar;
    private String timezone;
    private String email;

    public User() {
    }

    public User(String name, String thumbnail, String avatar, String timezone, String email) {
        this.name = name;
        this.thumbnail = thumbnail;
        this.avatar = avatar;
        this.timezone = timezone;
        this.email = email;
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

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
}
