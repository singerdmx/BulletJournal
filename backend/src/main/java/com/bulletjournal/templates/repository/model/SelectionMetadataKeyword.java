package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.AuditModel;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "selection_metadata_keywords", schema = "template")
public class SelectionMetadataKeyword extends AuditModel {

    @Id
    private String keyword;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "selection_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Selection selection;

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Selection getSelection() {
        return selection;
    }

    public void setSelection(Selection selection) {
        this.selection = selection;
    }
}
