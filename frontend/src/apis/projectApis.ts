import { doFetch, doPost, doDelete, doPatch, doPut } from './api-helper';
import { Project } from '../features/project/interface';
import { ContentAction } from '../features/project/constants';

export const fetchProjects = () => {
  return doFetch('/api/projects')
    .then((res) => res)
    .catch((err) => {
      throw Error(err.message);
    });
};

export const getProject = (projectId: number) => {
  return doFetch(`/api/projects/${projectId}`)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const createProject = (
  description: string,
  groupId: number,
  name: string,
  projectType: string
) => {
  const postBody = JSON.stringify({
    description: description,
    name: name,
    projectType: projectType,
    groupId: groupId,
  });
  return doPost('/api/projects', postBody)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const updateSharedProjectsOrder = (projectOwners: string[]) => {
  const postBody = JSON.stringify({
    projectOwners: projectOwners,
  });
  console.log(postBody);

  return doPost('/api/updateSharedProjectsOrder', postBody).catch((err) => {
    throw Error(err.message);
  });
};

export const deleteProject = (projectId: number) => {
  return doDelete(`/api/projects/${projectId}`).catch((err) => {
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
    name: name,
  });
  return doPatch(`/api/projects/${projectId}`, patchBody)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const updateProjectRelations = (projects: Project[], etag: string) => {
  const putBody = JSON.stringify(projects);
  return doPut('/api/projects', putBody, etag)
    .then((res) => res)
    .catch((err) => {
      throw Error(err.message);
    });
};

export const GetProjectHistory = (
  projectId: number,
  timezone: string,
  startDate: string,
  endDate: string,
  action: ContentAction,
  username: string
) => {
  return doFetch(
    `/api/projects/${projectId}/history?timezone=${timezone}&startDate=${startDate}&endDate=${endDate}&action=${action}&username=${username}`
  )
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};
