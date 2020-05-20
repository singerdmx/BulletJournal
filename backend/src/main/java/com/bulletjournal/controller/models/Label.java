package com.bulletjournal.controller.models;

import com.fasterxml.jackson.annotation.JsonInclude;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Objects;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Label {
    private Long id;

    @NotBlank
    @Size(min = 1, max = 100)
    private String value;

    private String icon;

    public Label() {
    }

    public Label(Long id,
                 @NotBlank @Size(min = 1, max = 100) String value,
                 String icon) {
        this.id = id;
        this.value = value;
        this.icon = icon;
    }

    public Label(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Label)) return false;
        Label label = (Label) o;
        return Objects.equals(getId(), label.getId()) &&
                Objects.equals(getValue(), label.getValue()) &&
                Objects.equals(getIcon(), label.getIcon());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getValue(), getIcon());
    }
}
