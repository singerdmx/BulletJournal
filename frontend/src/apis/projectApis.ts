import { doFetch, doPost, doDelete, doPatch, doPut } from './api-helper';
import { Project } from '../features/project/interface';

export const fetchProjects = () => {
  return doFetch("http://localhost:8081/api/projects")
    .then(res => res)
    .catch(err => {
      throw Error(err.message);
    });
};

export const getProject = (projectId: number) => {
  return doFetch(`http://localhost:8081/api/projects/${projectId}`)
    .then(res => res.json())
    .catch(err => {
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
    groupId: groupId
  });
  return doPost('http://localhost:8081/api/projects', postBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const updateSharedProjectsOrder = (projectOwners: string[]) => {
  const postBody = JSON.stringify({
    projectOwners: projectOwners
  });
  console.log(postBody);

  return doPost('http://localhost:8081/api/updateSharedProjectsOrder', postBody)
    .catch(err => {
      throw Error(err.message);
    });
};

export const deleteProject = (projectId: number) => {
  return doDelete(`http://localhost:8081/api/projects/${projectId}`).catch(err => {
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
  return doPatch(`http://localhost:8081/api/projects/${projectId}`, patchBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const updateProjectRelations = (projects: Project[]) => {
  const putBody = JSON.stringify(projects);
  return doPut('http://localhost:8081/api/projects', putBody)
    .then(res => {
      return res;
      console.log("updateProjectRelations -> res", res)
    })
    .catch(err => {
      throw Error(err.message);
    });
};
