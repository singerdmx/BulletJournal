package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.User;
import com.bulletjournal.util.StringUtil;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users_categories", schema = "template")
public class UserCategory {

    @EmbeddedId
    private UserCategoryKey userCategoryKey;

    @ManyToOne(targetEntity = User.class)
    @MapsId("user_id")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(targetEntity = Category.class)
    @MapsId("category_id")
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(targetEntity = SelectionMetadataKeyword.class)
    @MapsId("metadata_keyword")
    @JoinColumn(name = "metadata_keyword")
    private SelectionMetadataKeyword metadataKeyword;

    @Column(name = "selections")
    private String selections;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Project project;

    public UserCategory() {
    }

    public UserCategoryKey getUserCategoryKey() {
        return userCategoryKey;
    }

    public void setUserCategoryKey(UserCategoryKey userCategoryKey) {
        this.userCategoryKey = userCategoryKey;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public SelectionMetadataKeyword getMetadataKeyword() {
        return metadataKeyword;
    }

    public void setMetadataKeyword(SelectionMetadataKeyword metadataKeyword) {
        this.metadataKeyword = metadataKeyword;
    }

    public String getSelections() {
        if (this.selections == null) {
            this.selections = "";
        }
        return this.selections;
    }

    public List<Long> getSelectionIds() {
        return StringUtil.convertNumArray(this.selections);
    }

    public void setSelections(String selections) {
        if (StringUtils.isNotBlank(selections)) {
            selections = StringUtils.join(StringUtil.convertNumArray(selections), ",");
        }
        this.selections = selections;
    }

    public void setSelections(Set<String> selections) {
        if (selections == null) {
            this.selections = "";
            return;
        }
        List<String> selectionList = new ArrayList<>(selections);
        selectionList.sort((a, b) -> (int) (Long.parseLong(a) - Long.parseLong(b)));
        this.selections = String.join(",", selectionList);
    }
}
