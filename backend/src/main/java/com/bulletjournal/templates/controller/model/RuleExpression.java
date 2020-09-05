package com.bulletjournal.templates.controller.model;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class RuleExpression {
    @SerializedName("rule")
    private Criteria criteria;

    RuleExpression() {
    }

    RuleExpression(Criteria criteria) {
        this.criteria = criteria;
    }

    public Criteria getRule() {
        return criteria;
    }

    public void setRule(Criteria rule) {
        this.criteria = rule;
    }

    static class Criteria {
        private Long choiceId;
        private Condition condition;
        private List<Long> selectionIds;

        Criteria(Long choiceId, Condition condition, List<Long> selectionIds) {
            this.choiceId = choiceId;
            this.condition = condition;
            this.selectionIds = selectionIds;
        }

        public Long getChoiceId() {
            return choiceId;
        }

        public void setChoiceId(Long choiceId) {
            this.choiceId = choiceId;
        }

        public Condition getCondition() {
            return condition;
        }

        public void setCondition(Condition condition) {
            this.condition = condition;
        }

        public List<Long> getSelectionIds() {
            return selectionIds;
        }

        public void setSelectionIds(List<Long> selectionIds) {
            this.selectionIds = selectionIds;
        }
    }

    enum Condition {

        EXACT(0), CONTAINS(1), NOT_CONTAIN(2), IGNORE(3);

        private final int value;

        Condition(int value) {
            this.value = value;
        }

        public static Condition getType(int type) {
            switch (type) {
                case 0:
                    return EXACT;
                case 1:
                    return CONTAINS;
                case 2:
                    return NOT_CONTAIN;
                case 3:
                    return IGNORE;
                default:
                    throw new IllegalArgumentException();
            }
        }

        public static String toText(Condition type) {
            if (type == null) {
                return "NONE";
            }
            switch (type) {
                case EXACT:
                    return "EXACT";
                case CONTAINS:
                    return "CONTAINS";
                case NOT_CONTAIN:
                    return "NOT_CONTAIN";
                case IGNORE:
                    return "IGNORE";
                default:
                    throw new IllegalArgumentException();
            }
        }

        public int getValue() {
            return value;
        }
    }

}
