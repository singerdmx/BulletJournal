import { doFetch, doPost, doDelete, doPatch, doPut } from "./api-helper";
import { Project } from "../features/project/reducer";

export const fetchProjects = () => {
  return doFetch("/api/projects")
    .then(res => res)
    .catch(err => {
      throw Error(err);
    });
};

export const getProject = (projectId: number) => {
  return doFetch(`/api/projects/${projectId}`)
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};

export const createProject = (
  description: string,
  name: string,
  projectType: string
) => {
  const postBody = JSON.stringify({
    description: description,
    name: name,
    projectType: projectType
  });
  return doPost('/api/projects', postBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};

export const updateSharedProjectsOrder = (projectOwners: string[]) => {
  const postBody = JSON.stringify({
    projectOwners: projectOwners
  });

  return doPost('/api/updateSharedProjectsOrder', postBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};

export const deleteProject = (projectId: number) => {
  return doDelete(`/api/projects/${projectId}`).catch(err => {
    throw Error(err);
  });
};

export const updateProject = (
  projectId: number,
  description: string,
  groupId: number,
  name: string
) => {
  const patchBody = JSON.stringify({
    description: description,
    groupId: groupId,
    name: name
  });
  return doPatch(`/api/projects/${projectId}`, patchBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};

export const updateProjectRelations = (projects: Project[]) => {
  const putBody = JSON.stringify(projects);
  return doPut('/api/projects', putBody).catch(err => {
    throw Error(err);
  });
};
