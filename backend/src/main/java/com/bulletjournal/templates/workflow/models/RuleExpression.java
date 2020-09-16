package com.bulletjournal.templates.workflow.models;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class RuleExpression {
    @SerializedName("rule")
    private List<Criteria> criteriaList;

    @SerializedName("logicOperator")
    private LogicOperator logicOperator;

    RuleExpression() {
    }

    public RuleExpression(List<Criteria> criteriaList, LogicOperator logicOperator) {
        this.criteriaList = criteriaList;
        this.logicOperator = logicOperator;
    }

    public List<Criteria> getCriteriaList() {
        return criteriaList;
    }

    public void setCriteriaList(List<Criteria> criteriaList) {
        this.criteriaList = criteriaList;
    }

    public LogicOperator getLogicOperator() {
        return logicOperator;
    }

    public void setLogicOperator(LogicOperator logicOperator) {
        this.logicOperator = logicOperator;
    }

    public static class Criteria {
        private Condition condition;
        private List<Long> selectionIds;

        public Criteria(Condition condition, List<Long> selectionIds) {
            this.condition = condition;
            this.selectionIds = selectionIds;
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

    public enum LogicOperator {
        AND(0), OR(1);
        private final int value;

        LogicOperator(int value) {
            this.value = value;
        }

        public static LogicOperator getType(int type) {
            switch (type) {
                case 0:
                    return AND;
                case 1:
                    return OR;
                default:
                    throw new IllegalArgumentException();
            }
        }

        public static String toText(LogicOperator type) {
            if (type == null) {
                return "NONE";
            }
            switch (type) {
                case AND:
                    return "AND";
                case OR:
                    return "OR";
                default:
                    throw new IllegalArgumentException();
            }
        }

        public int getValue() {
            return value;
        }
    }

    public enum Condition {

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
