package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import java.util.List;

public class UpdateContentParams {

    @NotBlank
    private String text;

    private String mdiff;

    private List<ContentDiff> diff;

    public UpdateContentParams() {
    }

    public UpdateContentParams(@NotBlank String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getMdiff() {
        return mdiff;
    }

    public void setMdiff(String mdiff) {
        this.mdiff = mdiff;
    }

    public List<ContentDiff> getDiff() {
        return diff;
    }

    public void setDiff(List<ContentDiff> diff) {
        this.diff = diff;
    }
}
