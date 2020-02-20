import { doFetch, doPost } from './api-helper';

export const fetchProjects = () => {
  return doFetch('/api/projects')
    .then(res => res.json())
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
