package com.bulletjournal.templates.workflow.models;

import java.util.List;

public interface Selectable {
    List<Step> getNextSteps();
}
