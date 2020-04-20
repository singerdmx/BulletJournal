package com.bulletjournal.repository.utils;

import com.vladmihalcea.hibernate.type.array.internal.AbstractArrayTypeDescriptor;

public class StringArrayTypeDescriptor extends AbstractArrayTypeDescriptor<Long[]> {
    public static final StringArrayTypeDescriptor INSTANCE = new StringArrayTypeDescriptor();

    public StringArrayTypeDescriptor() {
        super(Long[].class);
    }

    protected String getSqlArrayType() {
        return "text";
    }
}
