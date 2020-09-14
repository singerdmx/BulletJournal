import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {message} from 'antd';
import {PayloadAction} from 'redux-starter-kit';
import {
  actions as templatesActions,
  AddCategoryAction, AddChoiceAction, AddSelectionAction,
  DeleteCategoryAction, DeleteChoiceAction, DeleteSelectionAction,
  GetCategoriesAction, GetCategoryAction, GetChoiceAction, GetChoicesAction, SetChoicesAction, UpdateCategoryAction,
  UpdateCategoryRelationsAction, UpdateChoiceAction, UpdateSelectionAction, GetStepsAction, CreateStepAction,
  GetStepAction, DeleteStepAction, GetNextStepAction, AddRuleAction, RemoveRuleAction
} from './reducer';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  putCategories,
  putCategory,
  updateChoicesForCategory
} from '../../apis/templates/categoryApis';
import {
  createChoice, deleteChoice, getChoice,
  getChoices, updateChoice
} from '../../apis/templates/choiceApis';
import {Category, Choice, NextStep, Rule, Selection, Step, Steps} from './interface';
import {createSelection, deleteSelection, updateSelection} from "../../apis/templates/selectionApis";
import {IState} from "../../store";
import {getSteps, createStep, getStep, deleteStep, updateChoicesForStep} from '../../apis/templates/stepApis';
import {getNext} from "../../apis/templates/workflowApis";
import {createRule, deleteRule} from "../../apis/templates/ruleApis";

function* fetchCategories(action: PayloadAction<GetCategoriesAction>) {
  try {
    const data: Category[] = yield call(getCategories);
    console.log(data)
    yield put(templatesActions.categoriesReceived({categories: data}));
  } catch (error) {
    yield call(message.error, `fetchCategories Error Received: ${error}`);
  }
}

function* fetchChoices(action: PayloadAction<GetChoicesAction>) {
  try {
    const data: Choice[] = yield call(getChoices);
    console.log(data)
    yield put(templatesActions.choicesReceived({choices: data}));
  } catch (error) {
    yield call(message.error, `fetchChoices Error Received: ${error}`);
  }
}

function* fetchChoice(action: PayloadAction<GetChoiceAction>) {
  try {
    const {choiceId} = action.payload;
    const data: Choice = yield call(getChoice, choiceId);
    console.log(data)
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
    yield call(message.error, `fetchChoices Error Received: ${error}`);
  }
}

function* fetchCategory(action: PayloadAction<GetCategoryAction>) {
  try {
    const {categoryId} = action.payload;
    const data: Category = yield call(getCategory, categoryId);
    console.log(data)
    yield put(templatesActions.categoryReceived({category: data}));
    yield put(templatesActions.nextStepReceived({step: undefined}));
  } catch (error) {
    yield call(message.error, `fetchCategory Error Received: ${error}`);
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
    yield call(message.error, `addCategory Error Received: ${error}`);
  }
}

function* updateCategory(action: PayloadAction<UpdateCategoryAction>) {
  try {
    const {categoryId, name, description, icon, color, forumId, image, nextStepId} = action.payload;
    const data: Category = yield call(putCategory,
        categoryId, name, description, icon, color, forumId, image, nextStepId);
    yield put(templatesActions.categoryReceived({category: data}));
  } catch (error) {
    yield call(message.error, `updateCategory Error Received: ${error}`);
  }
}

function* removeCategory(action: PayloadAction<DeleteCategoryAction>) {
  try {
    const {id} = action.payload;
    const data: Category[] = yield call(deleteCategory, id);
    yield put(templatesActions.categoriesReceived({categories: data}));
  } catch (error) {
    yield call(message.error, `removeCategory Error Received: ${error}`);
  }
}

function* updateCategories(action: PayloadAction<UpdateCategoryRelationsAction>) {
  try {
    const {categories} = action.payload;
    const data: Category[] = yield call(putCategories, categories);
    yield put(templatesActions.categoriesReceived({categories: data}));
  } catch (error) {
    yield call(message.error, `updateCategories Error Received: ${error}`);
  }
}

function* setCategoryChoices(action: PayloadAction<SetChoicesAction>) {
  try {
    const {id, choices} = action.payload;
    const data: Category = yield call(updateChoicesForCategory, id, choices);
    console.log(data)
    yield put(templatesActions.categoryReceived({category: data}));
  } catch (error) {
    yield call(message.error, `setCategoryChoices Error Received: ${error}`);
  }
}

function* setStepChoices(action: PayloadAction<SetChoicesAction>) {
  try {
    const {id, choices} = action.payload;
    const data: Step = yield call(updateChoicesForStep, id, choices);
    console.log(data)
    yield put(templatesActions.stepReceived({step: data}));
  } catch (error) {
    yield call(message.error, `setStepChoices Error Received: ${error}`);
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
    yield call(message.error, `addChoice Error Received: ${error}`);
  }
}

function* removeChoice(action: PayloadAction<DeleteChoiceAction>) {
  try {
    const {id} = action.payload;
    const data: Choice[] = yield call(deleteChoice, id);
    yield put(templatesActions.choicesReceived({choices: data}));
  } catch (error) {
    yield call(message.error, `removeChoice Error Received: ${error}`);
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
    yield call(message.error, `addSelection Error Received: ${error}`);
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
    yield call(message.error, `removeSelection Error Received: ${error}`);
  }
}

function* putChoice(action: PayloadAction<UpdateChoiceAction>) {
  try {
    const {id, name, multiple} = action.payload;
    const data: Choice = yield call(updateChoice, id, name, multiple);
    console.log(data)
    const choices: Choice[] = yield call(getChoices);
    console.log(choices)
    yield put(templatesActions.choicesReceived({choices: choices}));
  } catch (error) {
    yield call(message.error, `putChoice Error Received: ${error}`);
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
    yield call(message.error, `putSelection Error Received: ${error}`);
  }
}

function* fetchSteps(action: PayloadAction<GetStepsAction>) {
  try {
    const data: Steps = yield call(getSteps);
    console.log(data)
    yield put(templatesActions.stepsReceived({steps: data.steps}));
  } catch (error) {
    yield call(message.error, `fetchSteps Error Received: ${error}`);
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
    yield call(message.error, `addStep Error Received: ${error}`);
  }
}

function* fetchStep(action: PayloadAction<GetStepAction>) {
  try {
    const {stepId} = action.payload;
    const data: Step = yield call(getStep, stepId);
    console.log(data)
    yield put(templatesActions.stepReceived({step: data}));
  } catch (error) {
    yield call(message.error, `fetchStep Error Received: ${error}`);
  }
}

function* removeStep(action: PayloadAction<DeleteStepAction>) {
  try {
    const {stepId} = action.payload;
    yield call(deleteStep, stepId);
    const data: Steps = yield call(getSteps);
    yield put(templatesActions.stepsReceived({steps: data.steps}));
  } catch (error) {
    yield call(message.error, `removeStep Error Received: ${error}`);
  }
}

function* getNextStep(action: PayloadAction<GetNextStepAction>) {
  try {
    const {stepId, selections, first} = action.payload;
    const nextStep: NextStep = yield call(getNext, stepId, selections, first);
    yield put(templatesActions.nextStepReceived({step: nextStep}));
  } catch (error) {
    yield call(message.error, `getNextStep Error Received: ${error}`);
  }
}

function* addRule(action: PayloadAction<AddRuleAction>) {
  try {
    const {name, priority, connectedStepId, ruleExpression, categoryId, stepId} = action.payload;
    const data: Rule = yield call(createRule, name, connectedStepId, ruleExpression, priority, stepId, categoryId);
    console.log(data)
  } catch (error) {
    yield call(message.error, `addRule Error Received: ${error}`);
  }
}

function* removeRule(action: PayloadAction<RemoveRuleAction>) {
  try {
    const {ruleId} = action.payload;
    yield call(deleteRule, ruleId);
  } catch (error) {
    yield call(message.error, `removeRule Error Received: ${error}`);
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
    yield takeLatest(templatesActions.getCategory.type, fetchCategory),
    yield takeLatest(templatesActions.setCategoryChoices.type, setCategoryChoices),
    yield takeLatest(templatesActions.setStepChoices.type, setStepChoices),
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
  ])
}
