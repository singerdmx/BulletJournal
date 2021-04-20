package com.bulletjournal.repository;

import com.bulletjournal.controller.models.ProjectItemActivity;
import com.bulletjournal.repository.models.NoteAuditable;
import com.bulletjournal.repository.models.ProjectItemAuditModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class NoteAuditableDaoJpa {

  @Autowired private NoteAuditableRepository noteAuditableRepository;

  @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
  public void create(List<com.bulletjournal.notifications.NoteAuditable> noteAuditables) {
    this.noteAuditableRepository.saveAll(
        noteAuditables.stream()
            .map(com.bulletjournal.notifications.NoteAuditable::toRepositoryAuditable)
            .collect(Collectors.toList()));
  }

  @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
  public List<ProjectItemActivity> getHistory(Long noteId, int pageInd, int pageSize) {

    List<NoteAuditable> hist =
        this.noteAuditableRepository.findAllByNoteId(
            noteId, PageRequest.of(pageInd, pageSize, Sort.by("activityTime").descending()));
    return hist.stream()
        .map(ProjectItemAuditModel::toProjectItemActivity)
        .collect(Collectors.toList());
  }
}
