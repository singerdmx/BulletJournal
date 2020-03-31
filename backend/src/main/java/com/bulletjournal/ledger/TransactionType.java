package com.bulletjournal.ledger;

public enum TransactionType {
    INCOME(0, "Income"),
    EXPENSE(1, "Expense");

    private final int value;
    private final String text;

    TransactionType(int value, String text) {
        this.value = value;
        this.text = text;
    }

    public static TransactionType getType(int type) {
        switch (type) {
            case 0:
                return INCOME;
            case 1:
                return EXPENSE;
            default:
                throw new IllegalArgumentException();
        }
    }

    public int getValue() {
        return this.value;
    }

    public String getText() {
        return this.text;
    }
}
