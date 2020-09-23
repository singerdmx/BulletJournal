package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.User;
import com.bulletjournal.util.StringUtil;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.*;
import java.util.List;

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

    @Column(name = "selections")
    private String selections;

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
}
