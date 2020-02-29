package com.bulletjournal.controller.models;

public enum DayOfMonth {
    DAY_1(1), DAY_2(2), DAY_3(3), DAY_4(4), DAY_5(5),
    DAY_6(6), DAY_7(7), DAY_8(8), DAY_9(9), DAY_10(10),
    DAY_11(11), DAY_12(12), DAY_13(13), DAY_14(14), DAY_15(15),
    DAY_16(16), DAY_17(17), DAY_18(18), DAY_19(19), DAY_20(20),
    DAY_21(21), DAY_22(22), DAY_23(23), DAY_24(24), DAY_25(25),
    DAY_26(26), DAY_27(27), DAY_28(28), DAY_29(29), DAY_30(30),
    DAY_31(31), DAY_LAST(0);

    private int value;

    DayOfMonth(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
