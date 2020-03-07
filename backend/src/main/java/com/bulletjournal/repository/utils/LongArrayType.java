package com.bulletjournal.repository.utils;

import com.vladmihalcea.hibernate.type.array.internal.ArraySqlTypeDescriptor;
import org.hibernate.type.AbstractSingleColumnStandardBasicType;
import org.hibernate.usertype.DynamicParameterizedType;

import java.util.Properties;

public class LongArrayType extends AbstractSingleColumnStandardBasicType<Long[]> implements DynamicParameterizedType {

    public static final LongArrayType INSTANCE = new LongArrayType();

    public LongArrayType() {
        super(ArraySqlTypeDescriptor.INSTANCE, LongArrayTypeDescriptor.INSTANCE);
    }

    public String getName() {
        return "long-array";
    }

    @Override
    protected boolean registerUnderJavaType() {
        return true;
    }

    @Override
    public void setParameterValues(Properties parameters) {
        ((LongArrayTypeDescriptor) getJavaTypeDescriptor()).setParameterValues(parameters);
    }
}
