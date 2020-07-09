package com.bulletjournal.repository;

import com.bulletjournal.repository.models.SharedProjectItem;

import java.util.List;

public interface SharedProjectItemRepositoryCustom {
    List<SharedProjectItem> findSharedProjectItemsByLabelIds(String username, List<Long> labelIds);
}
