package com.bulletjournal.controller.models;

import com.bulletjournal.repository.models.OwnedModel;

import javax.persistence.*;

@Entity
@Table(name = "projectSetting")

public class ProjectSetting extends OwnedModel {
        @Id
        private Long id;

        @Column
        private String color;

        @Column
        private boolean autoDelete;

        public void setId(Long id) {
                this.id = id;
        }

        public String getColor() {
                return color;
        }

        public void setColor(String color) {
                this.color = color;
        }

        public boolean isAutoDelete() {
                return autoDelete;
        }

        public void setAutoDelete(boolean autoDelete) {
                this.autoDelete = autoDelete;
        }

        @Override
        public Long getId() {
                return id;
        }
}
