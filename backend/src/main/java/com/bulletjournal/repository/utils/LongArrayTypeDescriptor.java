package com.bulletjournal.repository.utils;

import com.vladmihalcea.hibernate.type.array.internal.AbstractArrayTypeDescriptor;

public class LongArrayTypeDescriptor extends AbstractArrayTypeDescriptor<Long[]> {
    public static final LongArrayTypeDescriptor INSTANCE = new LongArrayTypeDescriptor();

    public LongArrayTypeDescriptor() {
        super(Long[].class);
    }

    protected String getSqlArrayType() {
        return "bigint";
    }
}
