package com.bulletjournal.controller.models.params;

public class ChangeAliasParams {

    private String alias;

    public ChangeAliasParams() {
    }

    public ChangeAliasParams(String alias) {
        this.alias = alias;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }
}
