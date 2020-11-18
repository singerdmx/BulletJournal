import {doDelete, doFetch, doPatch, doPost, doPut} from './api-helper';
import {ReminderSetting, Task, TaskStatus} from '../features/tasks/interface';

export const fetchTasks = (
  projectId: number,
  assignee?: string,
  timezone?: string,
  startDate?: string,
  endDate?: string,
  order?: boolean
) => {
  let url = `/api/projects/${projectId}/tasks`;
  if (assignee) url += `?assignee=${assignee}`;
  if (order) {
    url += `?order=true&timezone=${timezone}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
  }
  return doFetch(url)
    .then((res) => res)
    .catch((err) => {
      throw Error(err.message);
    });
};

export const fetchCompletedTasks = (
  projectId: number,
  pageNo: number,
  pageSize: number,
  assignee?: string,
  startDate?: string,
  endDate?: string,
  timezone?: string
) => {
  let url = `/api/projects/${projectId}/completedTasks?`;
  if (startDate && startDate.length > 0) {
    url += `assignee=${assignee}&startDate=${startDate}&endDate=${endDate}&timezone=${timezone}`;
  } else {
    url += `pageNo=${pageNo}&pageSize=${pageSize}`;
  }
  return doFetch(url)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const getTaskById = (taskId: number) => {
  return doFetch(`/api/tasks/${taskId}`)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const getCompletedTaskById = (taskId: number) => {
  return doFetch(`/api/completedTasks/${taskId}`)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const deleteTaskById = (taskId: number) => {
  return doDelete(`/api/tasks/${taskId}`)
    .then((res) => res)
    .catch((err) => {
      throw Error(err.message);
    });
};

export const deleteTasks = (projectId: number, tasksId: number[]) => {
  let url = `/api/projects/${projectId}/tasks`;
  if (tasksId && tasksId.length > 0) {
    url += `?tasks=${tasksId[0]}`;

    for (var i = 1; i < tasksId.length; i++) {
      url += `&tasks=${tasksId[i]}`;
    }
  }
  return doDelete(url).catch((err) => {
    throw Error(err.message);
  });
};

export const completeTasks = (projectId: number, tasksId: number[]) => {
  let url = `/api/projects/${projectId}/complete`;
  if (tasksId && tasksId.length > 0) {
    url += `?tasks=${tasksId[0]}`;

    for (var i = 1; i < tasksId.length; i++) {
      url += `&tasks=${tasksId[i]}`;
    }
  }
  return doPost(url).catch((err) => {
    throw Error(err.message);
  });
};

export const deleteCompletedTaskById = (taskId: number) => {
  return doDelete(`/api/completedTasks/${taskId}`)
    .then((res) => res)
    .catch((err) => {
      throw Error(err.message);
    });
};

export const createTask = (
  projectId: number,
  name: string,
  assignees: string[],
  reminderSetting: ReminderSetting,
  timezone: string,
  dueDate?: string,
  dueTime?: string,
  duration?: number,
  recurrenceRule?: string,
  labels?: number[]
) => {
  const postBody = JSON.stringify({
    name: name,
    assignees: assignees,
    dueDate: dueDate,
    dueTime: dueTime,
    duration: duration,
    reminderSetting: reminderSetting,
    recurrenceRule: recurrenceRule,
    timezone: timezone,
    labels: labels,
  });
  return doPost(`/api/projects/${projectId}/tasks`, postBody)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const putTasks = (projectId: number, tasks: Task[], etag: string) => {
  const putBody = JSON.stringify(tasks);
  return doPut(`/api/projects/${projectId}/tasks`, putBody, etag).catch(
    (err) => {
      throw Error(err.message);
    }
  );
};

export const updateTask = (
  taskId: number,
  name?: string,
  assignees?: string[],
  dueDate?: string,
  dueTime?: string,
  duration?: number,
  timezone?: string,
  reminderSetting?: ReminderSetting,
  recurrenceRule?: string,
  labels?: number[]
) => {
  const patchBody = JSON.stringify({
    name: name,
    assignees: assignees,
    dueDate: dueDate,
    dueTime: dueTime,
    duration: duration,
    timezone: timezone,
    reminderSetting: reminderSetting,
    recurrenceRule: recurrenceRule,
    labels: labels,
  });
  return doPatch(`/api/tasks/${taskId}`, patchBody)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err);
    });
};

export const completeTaskById = (taskId: number, dateTime?: string) => {
  return doPost(`/api/tasks/${taskId}/complete`, dateTime)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err);
    });
};

export const uncompleteTaskById = (taskId: number) => {
  return doPost(`/api/tasks/${taskId}/uncomplete`)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err);
    });
};

export const setTaskLabels = (taskId: number, labels: number[]) => {
  const putBody = JSON.stringify(labels);
  return doPut(`/api/tasks/${taskId}/setLabels`, putBody)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const moveToTargetProject = (taskId: number, targetProject: number) => {
  const postBody = JSON.stringify({
    targetProject: targetProject,
  });
  return doPost(`/api/tasks/${taskId}/move`, postBody)
    .then((res) => res)
    .catch((err) => {
      throw Error(err);
    });
};

export const shareTaskWithOther = (
  taskId: number,
  generateLink: boolean,
  targetUser?: string,
  targetGroup?: number,
  ttl?: number
) => {
  const postBody = JSON.stringify({
    targetUser: targetUser,
    targetGroup: targetGroup,
    generateLink: generateLink,
    ttl: ttl,
  });
  return doPost(`/api/tasks/${taskId}/share`, postBody)
    .then((res) => (generateLink ? res.json() : res))
    .catch((err) => {
      throw Error(err);
    });
};

export const getSharables = (taskId: number) => {
  return doFetch(`/api/tasks/${taskId}/sharables`)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const revokeSharable = (
  taskId: number,
  user?: string,
  link?: string
) => {
  const postBody = JSON.stringify({
    user: user,
    link: link,
  });

  return doPost(`/api/tasks/${taskId}/revokeSharable`, postBody)
    .then((res) => res)
    .catch((err) => {
      throw Error(err);
    });
};

export const removeShared = (taskId: number) => {
  return doPost(`/api/tasks/${taskId}/removeShared`)
      .then((res) => res)
      .catch((err) => {
        throw Error(err);
      });
};

export const getContents = (taskId: number) => {
  return doFetch(`/api/tasks/${taskId}/contents`)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const getCompletedTaskContents = (taskId: number) => {
  return doFetch(`/api/completedTasks/${taskId}/contents`)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const addContent = (taskId: number, text: string) => {
  const postBody = JSON.stringify({
    text: text,
  });

  return doPost(`/api/tasks/${taskId}/addContent`, postBody)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err);
    });
};

export const deleteContent = (taskId: number, contentId: number) => {
  return doDelete(`/api/tasks/${taskId}/contents/${contentId}`)
    .then((res) => res)
    .catch((err) => {
      throw Error(err.message);
    });
};

export const updateContent = (
  taskId: number,
  contentId: number,
  text: string,
  etag: string,
  diff: string,
) => {
  const patchBody = JSON.stringify({
    text: text,
    diff: diff,
  });
  return doPatch(`/api/tasks/${taskId}/contents/${contentId}`, patchBody, etag)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err);
    });
};

export const updateSampleContent = (
    taskId: number,
    text: string,
) => {
  const patchBody = JSON.stringify({
    text: text,
  });
  return doPatch(`/api/sampleTasks/${taskId}/contents`, patchBody)
      .then((res) => res.json())
      .catch((err) => {
        throw Error(err);
      });
};

export const getContentRevision = (
  taskId: number,
  contentId: number,
  revisionId: number
) => {
  return doFetch(
    `/api/tasks/${taskId}/contents/${contentId}/revisions/${revisionId}`
  )
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const setTaskStatus = (taskId: number, taskStatus: TaskStatus, timezone: string) => {
  const postBody = JSON.stringify({
    status: taskStatus.toString() === 'DEFAULT' ? null : taskStatus.toString(),
    timezone: timezone
  });

  return doPost(`/api/tasks/${taskId}/setStatus`, postBody)
      .then((res) => res.json())
      .catch((err) => {
    throw Error(err);
  });
};

export const patchRevisionContents = (
    taskId: number,
    contentId: number,
    revisionContents: string[],
    etag: string,
) => {
  const patchBody = JSON.stringify({
    revisionContents: revisionContents,
  });
  return doPost(`/api/tasks/${taskId}/contents/${contentId}/patchRevisionContents`, patchBody, etag)
      .then((res) => res.json())
      .catch((err) => {
        throw Error(err);
      });
};

export const getTaskStatistics = (
    projectIds: number[],
    timezone: string,
    startDate: string,
    endDate: string
) => {
  // e.g. /api/taskStatistics?projectIds=11&projectIds=12&timezone=America%2FLos_Angeles&startDate=2020-01-01&endDate=2020-09-10
  if (projectIds.length === 0) {
    return Promise.resolve({'complete': 0, 'incomplete': 0, 'userTaskStatistics': []});
  }
  return doFetch(
      '/api/taskStatistics?' +
      projectIds.map(p => `projectIds=${p}`).join('&') +
      '&timezone=' +
      encodeURIComponent(timezone) +
      '&startDate=' +
      startDate +
      '&endDate=' +
      endDate
  )
      .then(res => res.json())
      .catch(err => {
        throw Error(err.message);
      });
}