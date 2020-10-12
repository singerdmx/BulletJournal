import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {message} from 'antd';
import {PayloadAction} from 'redux-starter-kit';
import {
  actions as templatesActions,
  AddCategoryAction,
  AddChoiceAction,
  AddSelectionAction,
  DeleteCategoryAction,
  DeleteChoiceAction,
  DeleteSelectionAction,
  GetCategoriesAction,
  GetCategoryAction,
  GetChoiceAction,
  GetChoicesAction,
  SetChoicesAction,
  UpdateCategoryAction,
  UpdateCategoryRelationsAction,
  UpdateChoiceAction,
  UpdateSelectionAction,
  GetStepsAction,
  CreateStepAction,
  GetStepAction,
  DeleteStepAction,
  GetNextStepAction,
  AddRuleAction,
  RemoveRuleAction,
  GetSampleTasksAction,
  AddSampleTaskAction,
  GetSampleTaskAction,
  RemoveSampleTaskAction,
  UpdateSampleTaskAction,
  CloneStepAction,
  UpdateStepAction,
  GetSampleTasksByScrollIdAction,
  ImportTasksAction,
  SetSampleTaskRuleAction,
  RemoveSampleTaskRuleAction,
  SetExcludedSelectionsAction
} from './reducer';
import {
  createCategory,
  deleteCategory,
  getCategories,
  putCategories,
  putCategory,
  getCategory,
  updateChoicesForCategory
} from '../../apis/templates/categoryApis';
import {
  createChoice, deleteChoice, getChoice,
  getChoices, updateChoice
} from '../../apis/templates/choiceApis';
import {Category, Choice, NextStep, Rule, SampleTask, SampleTasks, Selection, Step, Steps} from './interface';
import {createSelection, deleteSelection, updateSelection} from "../../apis/templates/selectionApis";
import {IState} from "../../store";
import {
  getSteps,
  createStep,
  getStep,
  deleteStep,
  updateChoicesForStep,
  cloneStep,
  putStep,
  updateExcludedSelectionsForStep
} from '../../apis/templates/stepApis';
import {
  createSampleTask,
  deleteSampleTask, deleteSampleTaskRule,
  fetchAdminSampleTask, fetchSampleTasksByScrollId,
  getNext,
  getSampleTasksByFilter, importSampleTasks, putSampleTask, upsertSampleTaskRule
} from "../../apis/templates/workflowApis";
import {createRule, deleteRule} from "../../apis/templates/ruleApis";
import {reloadReceived} from "../myself/actions";
import {SAMPLE_TASKS} from "../../pages/templates/steps.pages";

function* fetchCategories(action: PayloadAction<GetCategoriesAction>) {
  try {
    const data: Category[] = yield call(getCategories);
    console.log(data)
    yield put(templatesActions.categoriesReceived({categories: data}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `fetchCategories Error Received: ${error}`);
    }
  }
}

function* fetchChoices(action: PayloadAction<GetChoicesAction>) {
  try {
    const data: Choice[] = yield call(getChoices);
    console.log(data)
    yield put(templatesActions.choicesReceived({choices: data}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `fetchChoices Error Received: ${error}`);
    }
  }
}

function* fetchChoice(action: PayloadAction<GetChoiceAction>) {
  try {
    const {choiceId} = action.payload;
    const data: Choice = yield call(getChoice, choiceId);
    console.log(data)
    yield put(templatesActions.choiceReceived({choice: data}));
    const state: IState = yield select();
    const choices : Choice[] = [];
    state.templates.choices.forEach(c => {
      if (c.id === choiceId) {
        choices.push(data);
      } else {
        choices.push(c);
      }
    });
    console.log(choices)
    yield put(templatesActions.choicesReceived({choices: choices}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `fetchChoices Error Received: ${error}`);
    }
  }
}

function* fetchCategory(action: PayloadAction<GetCategoryAction>) {
  try {
    const {categoryId} = action.payload;
    const data: Category = yield call(getCategory, categoryId);
    yield put(templatesActions.categoryReceived({category: data}));
    yield put(templatesActions.nextStepReceived({step: undefined}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `fetchCategory Error Received: ${error}`);
    }
  }
}

function* addCategory(action: PayloadAction<AddCategoryAction>) {
  try {
    console.log(action.payload)
    const {name, description, icon, color, forumId, image, nextStepId} = action.payload;
    yield call(createCategory, name, description, icon, color, forumId, image, nextStepId);
    const data: Category[] = yield call(getCategories);
    yield put(templatesActions.categoriesReceived({categories: data}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `addCategory Error Received: ${error}`);
    }
  }
}

function* updateCategory(action: PayloadAction<UpdateCategoryAction>) {
  try {
    const {categoryId, name, needStartDate, description, icon, color, forumId, image, nextStepId} = action.payload;
    const data: Category = yield call(putCategory,
        categoryId, name, needStartDate, description, icon, color, forumId, image, nextStepId);
    yield put(templatesActions.categoryReceived({category: data}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `updateCategory Error Received: ${error}`);
    }
  }
}

function* updateStep(action: PayloadAction<UpdateStepAction>) {
  try {
    const {stepId, name, nextStepId} = action.payload;
    const data: Step = yield call(putStep, stepId, name, nextStepId);
    yield put(templatesActions.stepReceived({step: data}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `updateStep Error Received: ${error}`);
    }
  }
}

function* removeCategory(action: PayloadAction<DeleteCategoryAction>) {
  try {
    const {id} = action.payload;
    const data: Category[] = yield call(deleteCategory, id);
    yield put(templatesActions.categoriesReceived({categories: data}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `removeCategory Error Received: ${error}`);
    }
  }
}

function* updateCategories(action: PayloadAction<UpdateCategoryRelationsAction>) {
  try {
    const {categories} = action.payload;
    const data: Category[] = yield call(putCategories, categories);
    yield put(templatesActions.categoriesReceived({categories: data}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `updateCategories Error Received: ${error}`);
    }
  }
}

function* setCategoryChoices(action: PayloadAction<SetChoicesAction>) {
  try {
    const {id, choices} = action.payload;
    const data: Category = yield call(updateChoicesForCategory, id, choices);
    console.log(data)
    yield put(templatesActions.categoryReceived({category: data}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `setCategoryChoices Error Received: ${error}`);
    }
  }
}

function* setStepChoices(action: PayloadAction<SetChoicesAction>) {
  try {
    const {id, choices} = action.payload;
    const data: Step = yield call(updateChoicesForStep, id, choices);
    console.log(data)
    yield put(templatesActions.stepReceived({step: data}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `setStepChoices Error Received: ${error}`);
    }
  }
}

function* setStepExcludedSelections(action: PayloadAction<SetExcludedSelectionsAction>) {
  try {
    const {id, selections} = action.payload;
    const data: Step = yield call(updateExcludedSelectionsForStep, id, selections);
    console.log(data)
    yield put(templatesActions.stepReceived({step: data}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `setStepExcludedSelections Error Received: ${error}`);
    }
  }
}

function* addChoice(action: PayloadAction<AddChoiceAction>) {
  try {
    const {name, multiple} = action.payload;
    const data: Choice = yield call(createChoice, name, multiple);
    console.log(data)
    const choices: Choice[] = yield call(getChoices);
    console.log(choices)
    yield put(templatesActions.choicesReceived({choices: choices}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `addChoice Error Received: ${error}`);
    }
  }
}

function* removeChoice(action: PayloadAction<DeleteChoiceAction>) {
  try {
    const {id} = action.payload;
    const data: Choice[] = yield call(deleteChoice, id);
    yield put(templatesActions.choicesReceived({choices: data}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `removeChoice Error Received: ${error}`);
    }
  }
}

function* addSelection(action: PayloadAction<AddSelectionAction>) {
  try {
    const {choiceId, text} = action.payload;
    const data: Selection = yield call(createSelection, choiceId, text);
    console.log(data)
    const choices: Choice[] = yield call(getChoices);
    console.log(choices)
    yield put(templatesActions.choicesReceived({choices: choices}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `addSelection Error Received: ${error}`);
    }
  }
}

function* removeSelection(action: PayloadAction<DeleteSelectionAction>) {
  try {
    const {id} = action.payload;
    yield call(deleteSelection, id);
    const choices: Choice[] = yield call(getChoices);
    console.log(choices)
    yield put(templatesActions.choicesReceived({choices: choices}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `removeSelection Error Received: ${error}`);
    }
  }
}

function* putChoice(action: PayloadAction<UpdateChoiceAction>) {
  try {
    const {id, name, multiple, instructionIncluded} = action.payload;
    const data: Choice = yield call(updateChoice, id, name, multiple, instructionIncluded);
    console.log(data)
    const choices: Choice[] = yield call(getChoices);
    console.log(choices)
    yield put(templatesActions.choicesReceived({choices: choices}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `putChoice Error Received: ${error}`);
    }
  }
}

function* putSelection(action: PayloadAction<UpdateSelectionAction>) {
  try {
    const {id, text} = action.payload;
    const data: Selection = yield call(updateSelection, id, text);
    console.log(data)
    const choices: Choice[] = yield call(getChoices);
    console.log(choices)
    yield put(templatesActions.choicesReceived({choices: choices}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `putSelection Error Received: ${error}`);
    }
  }
}

function* fetchSteps(action: PayloadAction<GetStepsAction>) {
  try {
    const data: Steps = yield call(getSteps);
    console.log(data)
    yield put(templatesActions.stepsReceived({steps: data.steps}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `fetchSteps Error Received: ${error}`);
    }
  }
}

function* addStep(action: PayloadAction<CreateStepAction>) {
  try {
    console.log(action.payload)
    const {name, nextStepId} = action.payload;
    yield call(createStep, name, nextStepId);
    const data: Steps = yield call(getSteps);
    yield put(templatesActions.stepsReceived({steps: data.steps}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `addStep Error Received: ${error}`);
    }
  }
}

function* copyStep(action: PayloadAction<CloneStepAction>) {
  try {
    console.log(action.payload)
    const {stepId} = action.payload;
    yield call(cloneStep, stepId);
    const data: Steps = yield call(getSteps);
    yield put(templatesActions.stepsReceived({steps: data.steps}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `cloneStep Error Received: ${error}`);
    }
  }
}

function* fetchStep(action: PayloadAction<GetStepAction>) {
  try {
    const {stepId} = action.payload;
    const data: Step = yield call(getStep, stepId);
    console.log(data)
    yield put(templatesActions.stepReceived({step: data}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `fetchStep Error Received: ${error}`);
    }
  }
}

function* removeStep(action: PayloadAction<DeleteStepAction>) {
  try {
    const {stepId} = action.payload;
    yield call(deleteStep, stepId);
    const data: Steps = yield call(getSteps);
    yield put(templatesActions.stepsReceived({steps: data.steps}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `removeStep Error Received: ${error}`);
    }
  }
}

function* getNextStep(action: PayloadAction<GetNextStepAction>) {
  const state: IState = yield select();
  if (state.templates.loadingNextStep) {
    return;
  }
  yield put(templatesActions.loadingNextStepReceived({loading: true}));
  try {
    const {stepId, selections, prevSelections, first} = action.payload;
    const nextStep: NextStep = yield call(getNext, stepId, selections, prevSelections, first);
    yield put(templatesActions.nextStepReceived({step: nextStep}));
    if (nextStep.sampleTasks && nextStep.sampleTasks.length > 0) {
      yield put(templatesActions.sampleTasksReceived({tasks: nextStep.sampleTasks, scrollId: nextStep.scrollId}));
      localStorage.setItem(SAMPLE_TASKS, JSON.stringify({
        sampleTasks: nextStep.sampleTasks,
        scrollId: nextStep.scrollId
      }));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `getNextStep Error Received: ${error}`);
    }
  }
  yield put(templatesActions.loadingNextStepReceived({loading: false}));
}

function* importTasks(action: PayloadAction<ImportTasksAction>) {
  const state: IState = yield select();
  if (state.templates.loadingNextStep) {
    return;
  }
  yield put(templatesActions.loadingNextStepReceived({loading: true}));
  const {postOp, timeoutOp, categoryId, projectId, assignees, reminderBefore,
    sampleTasks, selections, labels, subscribed, startDate, timezone} = action.payload;
  try {
    const data: SampleTask[] = yield call(importSampleTasks, sampleTasks, selections, categoryId,
        projectId, assignees, state.templates.scrollId, reminderBefore, labels, subscribed, startDate, timezone);
    yield put(templatesActions.sampleTasksReceived({tasks: data, scrollId: ''}));
    localStorage.setItem(SAMPLE_TASKS, JSON.stringify({
      sampleTasks: data,
      scrollId: ''
    }));
    postOp();
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else if (error.message === '504') {
      timeoutOp();
    } else {
      yield call(message.error, `importTasks Error Received: ${error}`);
    }
  }
  yield put(templatesActions.loadingNextStepReceived({loading: false}));
}

function* addRule(action: PayloadAction<AddRuleAction>) {
  try {
    const {name, priority, connectedStepId, ruleExpression, categoryId, stepId} = action.payload;
    const data: Rule = yield call(createRule, name, connectedStepId, ruleExpression, priority, stepId, categoryId);
    console.log(data)
    if (stepId) {
      yield put(templatesActions.getStep({stepId: stepId}));
    }
    if (categoryId) {
      yield put(templatesActions.getCategory({categoryId: categoryId}));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `addRule Error Received: ${error}`);
    }
  }
}

function* removeRule(action: PayloadAction<RemoveRuleAction>) {
  try {
    const {ruleId, ruleType} = action.payload;
    yield call(deleteRule, ruleId, ruleType);
    const state: IState = yield select();
    if (ruleType === 'CATEGORY_RULE') {
      yield put(templatesActions.getCategory({categoryId: state.templates.category!.id}));
    } else {
      yield put(templatesActions.getStep({stepId: state.templates.step!.id}));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `removeRule Error Received: ${error}`);
    }
  }
}

function* getSampleTasks(action: PayloadAction<GetSampleTasksAction>) {
  try {
    const {filter} = action.payload;
    const data : SampleTask[] = yield call(getSampleTasksByFilter, filter);
    yield put(templatesActions.sampleTasksReceived({tasks: data, scrollId: ''}));
    localStorage.setItem(SAMPLE_TASKS, JSON.stringify({
      sampleTasks: data,
      scrollId: ''
    }));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `getSampleTasks Error Received: ${error}`);
    }
  }
}

function* addSampleTask(action: PayloadAction<AddSampleTaskAction>) {
  try {
    const {name, uid, content, metadata} = action.payload;
    yield call(createSampleTask, name, uid, content, metadata);
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `addSampleTask Error Received: ${error}`);
    }
  }
}

function* getSampleTask(action: PayloadAction<GetSampleTaskAction>) {
  try {
    const {sampleTaskId} = action.payload;
    const data : SampleTask = yield call(fetchAdminSampleTask, sampleTaskId);
    yield put(templatesActions.sampleTaskReceived({task: data}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `getSampleTask Error Received: ${error}`);
    }
  }
}

function* removeSampleTask(action: PayloadAction<RemoveSampleTaskAction>) {
  try {
    const {taskId} = action.payload;
    yield call(deleteSampleTask, taskId);
    yield put(templatesActions.sampleTaskReceived({task: undefined}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `removeSampleTask Error Received: ${error}`);
    }
  }
}

function* updateSampleTask(action: PayloadAction<UpdateSampleTaskAction>) {
  try {
    const {sampleTaskId, name, uid, content, metadata, pending, refreshable} = action.payload;
    const data : SampleTask = yield call(putSampleTask, sampleTaskId, name, uid, content, metadata, pending, refreshable);
    yield put(templatesActions.sampleTaskReceived({task: data}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `updateSampleTask Error Received: ${error}`);
    }
  }
}

function* getSampleTasksByScrollId(action: PayloadAction<GetSampleTasksByScrollIdAction>) {
  const state: IState = yield select();
  if (state.templates.loadingNextStep) {
    return;
  }
  yield put(templatesActions.loadingNextStepReceived({loading: true}));
  try {
    const {scrollId, pageSize} = action.payload;
    const data : SampleTasks = yield call(fetchSampleTasksByScrollId, scrollId, pageSize);
    const state: IState = yield select();
    let tasks = state.templates.sampleTasks;
    tasks = tasks.concat(data.sampleTasks);
    yield put(templatesActions.sampleTasksReceived({tasks: tasks.concat(data.sampleTasks), scrollId: data.scrollId}));
    localStorage.setItem(SAMPLE_TASKS, JSON.stringify({
      sampleTasks: tasks,
      scrollId: data.scrollId
    }));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `getSampleTasksByScrollId Error Received: ${error}`);
    }
  }
  yield put(templatesActions.loadingNextStepReceived({loading: false}));
}

function* setSampleTaskRule(action: PayloadAction<SetSampleTaskRuleAction>) {
  try {
    const {taskIds, selectionCombo, stepId} = action.payload;
    yield call(upsertSampleTaskRule, stepId, selectionCombo, taskIds);
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `setSampleTaskRule Error Received: ${error}`);
    }
  }
}

function* removeSampleTaskRule(action: PayloadAction<RemoveSampleTaskRuleAction>) {
  try {
    const {selectionCombo, stepId} = action.payload;
    yield call(deleteSampleTaskRule, stepId, selectionCombo);
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `removeSampleTaskRule Error Received: ${error}`);
    }
  }
}

export default function* TemplatesSagas() {
  yield all([
    yield takeLatest(templatesActions.getCategories.type, fetchCategories),
    yield takeLatest(templatesActions.getChoices.type, fetchChoices),
    yield takeLatest(templatesActions.getChoice.type, fetchChoice),
    yield takeLatest(templatesActions.addCategory.type, addCategory),
    yield takeLatest(templatesActions.updateCategoryRelations.type, updateCategories),
    yield takeLatest(templatesActions.deleteCategory.type, removeCategory),
    yield takeLatest(templatesActions.deleteChoice.type, removeChoice),
    yield takeLatest(templatesActions.updateCategory.type, updateCategory),
    yield takeLatest(templatesActions.updateStep.type, updateStep),
    yield takeLatest(templatesActions.getCategory.type, fetchCategory),
    yield takeLatest(templatesActions.setCategoryChoices.type, setCategoryChoices),
    yield takeLatest(templatesActions.setStepChoices.type, setStepChoices),
    yield takeLatest(templatesActions.setStepExcludedSelections.type, setStepExcludedSelections),
    yield takeLatest(templatesActions.addChoice.type, addChoice),
    yield takeLatest(templatesActions.updateChoice.type, putChoice),
    yield takeLatest(templatesActions.addSelection.type, addSelection),
    yield takeLatest(templatesActions.deleteSelection.type, removeSelection),
    yield takeLatest(templatesActions.updateSelection.type, putSelection),
    yield takeLatest(templatesActions.getSteps.type, fetchSteps),
    yield takeLatest(templatesActions.getStep.type, fetchStep),
    yield takeLatest(templatesActions.createStep.type, addStep),
    yield takeLatest(templatesActions.deleteStep.type, removeStep),
    yield takeLatest(templatesActions.getNextStep.type, getNextStep),
    yield takeLatest(templatesActions.createRule.type, addRule),
    yield takeLatest(templatesActions.removeRule.type, removeRule),
    yield takeLatest(templatesActions.getSampleTasks.type, getSampleTasks),
    yield takeLatest(templatesActions.addSampleTask.type, addSampleTask),
    yield takeLatest(templatesActions.getSampleTask.type, getSampleTask),
    yield takeLatest(templatesActions.removeSampleTask.type, removeSampleTask),
    yield takeLatest(templatesActions.updateSampleTask.type, updateSampleTask),
    yield takeLatest(templatesActions.copyStep.type, copyStep),
    yield takeLatest(templatesActions.getSampleTasksByScrollId.type, getSampleTasksByScrollId),
    yield takeLatest(templatesActions.importTasks.type, importTasks),
    yield takeLatest(templatesActions.setSampleTaskRule.type, setSampleTaskRule),
    yield takeLatest(templatesActions.removeSampleTaskRule.type, removeSampleTaskRule),
  ])
}
