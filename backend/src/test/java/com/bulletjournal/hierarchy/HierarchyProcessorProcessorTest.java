package com.bulletjournal.hierarchy;

import com.bulletjournal.controller.models.Project;
import com.bulletjournal.repository.models.Group;
import com.google.common.collect.ImmutableSet;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.junit.Test;

import java.util.*;

import static org.junit.Assert.*;

/**
 * Tests {@link HierarchyProcessor}
 */
public class HierarchyProcessorProcessorTest {

    public static List<Project> createSampleProjectRelations(
            Project p1, Project p2, Project p3, Project p4, Project p5, Project p6) {
        /**
         *  p1
         *   |
         *    -- p2
         *   |   |
         *   |    -- p3
         *   |
         *    -- p4
         *
         *  p5
         *   |
         *    -- p6
         */
        List<Project> projectRelations = new ArrayList<>();
        projectRelations.add(p1);
        p1.addSubProject(p2);
        p1.addSubProject(p4);
        p2.addSubProject(p3);
        projectRelations.add(p5);
        p5.addSubProject(p6);
        return projectRelations;
    }

    /**
     * Tests {@link HierarchyProcessor#findAllIds(String, Set)}
     */
    @Test
    public void testFindAllIds() {
        List<Project> projects = new ArrayList<>();
        for (long i = 1; i <= 6; i++) {
            projects.add(createProject(i));
        }
        Project p1 = projects.get(0);
        Project p2 = projects.get(1);
        Project p3 = projects.get(2);
        Project p4 = projects.get(3);
        Project p5 = projects.get(4);
        Project p6 = projects.get(5);
        List<Project> projectHierarchy = createSampleProjectRelations(p1, p2, p3, p4, p5, p6);

        /**
         *  p1
         *   |
         *    -- p2
         *   |   |
         *   |    -- p3
         *   |
         *    -- p4
         *
         *  p5
         *   |
         *    -- p6
         */
        String relations = ProjectRelationsProcessor.processRelations(projectHierarchy);

        Set<Long> set = new HashSet<>();
        set.add(p1.getId());
        set.add(p6.getId());

        Pair<List<HierarchyItem>, Set<Long>> ret = HierarchyProcessor.findAllIds(relations, set);

        List<HierarchyItem> hierarchy = ret.getLeft();

        assertEquals(1, hierarchy.size());
        assertEquals(1L, hierarchy.get(0).getId().longValue());
        assertEquals(0, hierarchy.get(0).getS().size());
        CollectionUtils.isEqualCollection(ImmutableSet.of(1L), ret.getRight());


        ret = HierarchyProcessor.findAllIds(relations, null);
        hierarchy = ret.getLeft();
        assertEquals(2, hierarchy.size());
        assertTrue(CollectionUtils.isEqualCollection(ImmutableSet.of(1L, 2L, 3L, 4L, 5L, 6L), ret.getRight()));

        set = new HashSet<>();
        set.add(p1.getId());
        set.add(p3.getId());
        set.add(p4.getId());
        set.add(p5.getId());

        ret = HierarchyProcessor.findAllIds(relations, set);
        hierarchy = ret.getLeft();
        assertEquals(2, hierarchy.size());
        assertTrue(CollectionUtils.isEqualCollection(ImmutableSet.of(1L, 4L, 5L), ret.getRight()));
    }

    /**
     * Tests {@link ProjectRelationsProcessor#processRelations(Map, String, Set)}
     */
    @Test
    public void testProjectRelationsProcessor() {
        List<Project> projects = new ArrayList<>();
        for (long i = 1; i <= 6; i++) {
            projects.add(createProject(i));
        }
        Project p1 = projects.get(0);
        Project p2 = projects.get(1);
        Project p3 = projects.get(2);
        Project p4 = projects.get(3);
        Project p5 = projects.get(4);
        Project p6 = projects.get(5);

        String projectRelations = ProjectRelationsProcessor.processRelations(
                createSampleProjectRelations(p1, p2, p3, p4, p5, p6));
        Map<Long, com.bulletjournal.repository.models.Project> projectMap = new HashMap<>();
        for (int i = 1; i <= 6; i++) {
            com.bulletjournal.repository.models.Project p =
                    new com.bulletjournal.repository.models.Project();
            Long id = Long.valueOf(i);
            p.setId(id);
            p.setType(0);
            p.setGroup(new Group());
            p.setName("P" + i);
            projectMap.put(id, p);
        }
        projects = ProjectRelationsProcessor.processRelations(projectMap, projectRelations, null);
        assertEquals(2, projects.size());
        assertEquals(p1.getId(), projects.get(0).getId());
        assertEquals(p5.getId(), projects.get(1).getId());
        assertEquals(2, projects.get(0).getSubProjects().size());
        assertEquals(p2.getId(), projects.get(0).getSubProjects().get(0).getId());
        assertEquals(p4.getId(), projects.get(0).getSubProjects().get(1).getId());
        assertEquals(1, projects.get(1).getSubProjects().size());
        assertEquals(p6.getId(), projects.get(1).getSubProjects().get(0).getId());
        assertEquals(1, projects.get(0).getSubProjects().get(0).getSubProjects().size());
        assertEquals(p3.getId(), projects.get(0).getSubProjects().get(0).getSubProjects().get(0).getId());

        projects = ProjectRelationsProcessor.processRelations(projectMap, projectRelations,
                ImmutableSet.of(1L, 2L, 3L, 4L));
        assertEquals(1, projects.size());
        assertEquals(p1.getId(), projects.get(0).getId());
        assertEquals(2, projects.get(0).getSubProjects().size());
        assertEquals(p2.getId(), projects.get(0).getSubProjects().get(0).getId());
        assertEquals(p4.getId(), projects.get(0).getSubProjects().get(1).getId());
        assertEquals(1, projects.get(0).getSubProjects().get(0).getSubProjects().size());
        assertEquals(p3.getId(), projects.get(0).getSubProjects().get(0).getSubProjects().get(0).getId());

        projects = ProjectRelationsProcessor.processRelations(projectMap, projectRelations,
                ImmutableSet.of(5L, 6L));
        assertEquals(1, projects.size());
        assertEquals(p5.getId(), projects.get(0).getId());
        assertEquals(1, projects.get(0).getSubProjects().size());
        assertEquals(p6.getId(), projects.get(0).getSubProjects().get(0).getId());

        projects = ProjectRelationsProcessor.processRelations(projectMap, projectRelations,
                ImmutableSet.of(3L, 4L, 6L));
        assertEquals(2, projects.size());
        assertEquals(p1.getId(), projects.get(0).getId());
        assertNotNull(projects.get(0).getName());
        assertNull(projects.get(0).getOwner());
        assertEquals(p5.getId(), projects.get(1).getId());
        assertNotNull(projects.get(1).getName());
        assertNull(projects.get(1).getOwner());
        assertEquals(2, projects.get(0).getSubProjects().size());
        assertEquals(p2.getId(), projects.get(0).getSubProjects().get(0).getId());
        assertNotNull(projects.get(0).getSubProjects().get(0).getName());
        assertNull(projects.get(0).getSubProjects().get(0).getOwner());
        assertEquals(p4.getId(), projects.get(0).getSubProjects().get(1).getId());
        assertNotNull(projects.get(0).getSubProjects().get(1).getName());
        assertEquals(1, projects.get(1).getSubProjects().size());
        assertEquals(p6.getId(), projects.get(1).getSubProjects().get(0).getId());
        assertNotNull(projects.get(1).getSubProjects().get(0).getName());
        assertEquals(1, projects.get(0).getSubProjects().get(0).getSubProjects().size());
        assertEquals(p3.getId(), projects.get(0).getSubProjects().get(0).getSubProjects().get(0).getId());
        assertNotNull(projects.get(0).getSubProjects().get(0).getSubProjects().get(0).getName());

        projects = ProjectRelationsProcessor.processRelations(projectMap, projectRelations,
                ImmutableSet.of(1L, 5L));
        assertEquals(2, projects.size());
        assertEquals(p1.getId(), projects.get(0).getId());
        assertNotNull(projects.get(0).getName());
        assertEquals(p5.getId(), projects.get(1).getId());
        assertNotNull(projects.get(1).getName());
        assertTrue(projects.get(0).getSubProjects().isEmpty());
        assertTrue(projects.get(1).getSubProjects().isEmpty());

        projects = ProjectRelationsProcessor.processRelations(projectMap, projectRelations,
                ImmutableSet.of(1L, 2L));
        assertEquals(1, projects.size());
        assertEquals(p1.getId(), projects.get(0).getId());
        assertNotNull(projects.get(0).getName());
        assertEquals(1, projects.get(0).getSubProjects().size());
        assertEquals(p2.getId(), projects.get(0).getSubProjects().get(0).getId());
        assertNotNull(projects.get(0).getSubProjects().get(0).getName());
        assertTrue(projects.get(0).getSubProjects().get(0).getSubProjects().isEmpty());
    }

    private Project createProject(Long id) {
        Project project = new Project(id);
        project.setName("P" + id);
        return project;
    }
}
