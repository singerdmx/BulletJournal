import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {message} from 'antd';
import {
  actions as transactionsActions, ChangeBankAccountBalanceAction,
  CreateContent,
  CreateTransaction,
  DeleteContent,
  DeleteTransaction,
  DeleteTransactions, GetBankAccountTransactionsAction,
  GetTransaction,
  GetTransactionsByPayer,
  MoveTransaction,
  PatchContent,
  PatchTransaction,
  SetTransactionLabels,
  ShareTransaction,
  ShareTransactionByEmailAction,
  TransactionApiErrorAction,
  UpdateRecurringTransactions, UpdateTransactionBankAccountAction,
  UpdateTransactionColorAction,
  UpdateTransactionContentRevision,
  UpdateTransactionContents,
  UpdateTransactions,
} from './reducer';
import {IState} from '../../store';
import {PayloadAction} from 'redux-starter-kit';
import {
  addContent,
  createTransaction,
  deleteContent,
  deleteTransactionById,
  deleteTransactions as deleteTransactionsApi,
  fetchRecurringTransactions,
  fetchTransactions,
  getContentRevision,
  getContents,
  getTransactionById,
  moveToTargetProject,
  putTransactionColor,
  putTransactionBankAccount,
  setTransactionLabels,
  shareTransactionByEmail,
  shareTransactionWithOther,
  updateContent,
  updateTransaction,
} from '../../apis/transactionApis';
import {BankAccount, LedgerSummary, Transaction, TransactionView} from './interface';
import {getProjectItemsAfterUpdateSelect} from '../myBuJo/actions';
import {updateRecurringTransactions, updateTransactionContents} from './actions';
import {Content, ProjectItems, Revision} from '../myBuJo/interface';
import {projectLabelsUpdate, updateItemsByLabels} from '../label/actions';
import {ProjectItemUIType} from "../project/constants";
import {ContentType} from "../myBuJo/constants";
import {recentItemsReceived} from "../recent/actions";
import {setDisplayMore, updateTargetContent} from "../content/actions";
import {reloadReceived} from "../myself/actions";
import {fetchBankAccounts, fetchBankAccountTransactions, setAccountBalance} from "../../apis/bankAccountApis";
import {actions as myselfActions} from "../myself/reducer";


function* transactionApiErrorReceived(
  action: PayloadAction<TransactionApiErrorAction>
) {
  yield call(message.error, `Notice Error Received: ${action.payload.error}`);
}

function* transactionsUpdate(action: PayloadAction<UpdateTransactions>) {
  try {
    const {
      projectId,
      timezone,
      startDate,
      endDate,
      frequencyType,
      ledgerSummaryType,
      labelsToKeep,
      labelsToRemove
    } = action.payload;

    const data = yield call(
      fetchTransactions,
      projectId,
      timezone,
      ledgerSummaryType,
      frequencyType,
      startDate,
      endDate,
      undefined,
      labelsToKeep,
      labelsToRemove
    );
    const ledgerSummary: LedgerSummary = yield data.json();

    yield put(
      transactionsActions.transactionsReceived({
        ledgerSummary: ledgerSummary,
      })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Transaction Error Received: ${error}`);
    }
  }
}

function* recurringTransactionsUpdate(action: PayloadAction<UpdateRecurringTransactions>) {
  try {
    const {projectId} = action.payload;
    const data = yield call(fetchRecurringTransactions, projectId);
    yield put(
        transactionsActions.recurringTransactionsReceived({
          transactions: data,
        })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `recurringTransactionsUpdate Error Received: ${error}`);
    }
  }
}

function* transactionCreate(action: PayloadAction<CreateTransaction>) {
  try {
    const {
      projectId,
      amount,
      name,
      payer,
      transactionType,
      date,
      timezone,
      location,
      labels,
      time,
      recurrenceRule,
      bankAccountId,
      onSuccess
  } = action.payload;
    yield call(
      createTransaction,
      projectId,
      amount,
      name,
      payer,
      transactionType,
      timezone,
      location,
      date,
      time,
      recurrenceRule,
      labels,
      bankAccountId
    );

    const state: IState = yield select();
    const data = yield call(
      fetchTransactions,
      projectId,
      state.transaction.timezone,
      state.transaction.ledgerSummaryType,
      state.transaction.frequencyType,
      state.transaction.startDate,
      state.transaction.endDate
    );
    const ledgerSummary: LedgerSummary = yield data.json();
    yield put(
      transactionsActions.transactionsReceived({
        ledgerSummary: ledgerSummary,
      })
    );
    if (state.project.project) {
      yield put(projectLabelsUpdate(state.project.project.id, state.project.project.shared));
    }
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `transactionCreate Error Received: ${error}`);
    }
  }
}

function* transactionMove(action: PayloadAction<MoveTransaction>) {
  try {
    const { transactionId, targetProject, history } = action.payload;
    yield call(moveToTargetProject, transactionId, targetProject);
    yield call(message.success, 'Transaction moved successfully');
    history.push(`/projects/${targetProject}`);
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `transactionMove Error Received: ${error}`);
    }
  }
}

function* shareTransaction(action: PayloadAction<ShareTransaction>) {
  try {
    const {
      transactionId,
      targetUser,
      targetGroup,
      generateLink,
    } = action.payload;
    yield call(
      shareTransactionWithOther,
      transactionId,
      targetUser,
      targetGroup,
      generateLink
    );
    yield call(message.success, 'Transaction shared successfully');
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `shareTransaction Error Received: ${error}`);
    }
  }
}

function* getTransaction(action: PayloadAction<GetTransaction>) {
  try {
    const data = yield call(getTransactionById, action.payload.transactionId);
    yield put(transactionsActions.transactionReceived({ transaction: data }));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, 'Transaction Unavailable');
    }
  }
}

function* deleteTransaction(action: PayloadAction<DeleteTransaction>) {
  try {
    const { transactionId, type, dateTime, onSuccess } = action.payload;
    const state: IState = yield select();
    const transaction : Transaction = yield call(getTransactionById, transactionId);
    yield call(deleteTransactionById, transactionId, dateTime);

    if (onSuccess) {
      onSuccess();
    }
    if (type === ProjectItemUIType.PROJECT || type === ProjectItemUIType.PAYER || type === ProjectItemUIType.MANAGE_RECURRING) {
      const data = yield call(
        fetchTransactions,
        transaction.projectId,
        state.transaction.timezone,
        state.transaction.ledgerSummaryType,
        state.transaction.frequencyType,
        state.transaction.startDate,
        state.transaction.endDate
      );
      const ledgerSummary: LedgerSummary = yield data.json();
      yield put(
        transactionsActions.transactionsReceived({
          ledgerSummary: ledgerSummary,
        })
      );
    }

    if (type === ProjectItemUIType.TODAY) {
      yield put(
        getProjectItemsAfterUpdateSelect(
          state.myBuJo.todoSelected,
          state.myBuJo.ledgerSelected,
          state.myBuJo.noteSelected,
          'today'
        )
      );
    }

    if (type === ProjectItemUIType.LABEL) {
      const labelItems: ProjectItems[] = [];
      state.label.items.forEach((projectItem: ProjectItems) => {
        projectItem = { ...projectItem };
        if (projectItem.transactions) {
          projectItem.transactions = projectItem.transactions.filter(
            (t) => t.id !== transactionId
          );
        }
        labelItems.push(projectItem);
      });
      yield put(updateItemsByLabels(labelItems));
    }

    if (type === ProjectItemUIType.PAYER) {
      const transactionsByPayer = state.transaction.transactionsByPayer.filter(
          (t) => t !== transaction
      );
      yield put(
          transactionsActions.transactionsByPayerReceived({
            transactionsByPayer: transactionsByPayer,
          })
      );
    }

    if (type === ProjectItemUIType.MANAGE_RECURRING) {
      yield put(updateRecurringTransactions(transaction.projectId));
    }

    if (type === ProjectItemUIType.RECENT) {
      const recentItems = state.recent.items.filter((t) => t.contentType !== ContentType.TRANSACTION || t.id !== transactionId);
      yield put(recentItemsReceived(recentItems));
    }

    yield put(transactionsActions.transactionReceived({transaction: undefined}));
    if (state.project.project && type && ![ProjectItemUIType.LABEL, ProjectItemUIType.TODAY, ProjectItemUIType.RECENT].includes(type)) {
      yield put(projectLabelsUpdate(state.project.project.id, state.project.project.shared));
    }
    yield call(message.success, `Transaction '${transaction.name}' deleted successfully`);
    yield put(
        transactionsActions.transactionReceived({ transaction: undefined })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Delete Transaction Error Received: ${error}`);
    }
  }
}

function* deleteTransactions(action: PayloadAction<DeleteTransactions>) {
  try {
    const { projectId, transactions, type } = action.payload;
    const state: IState = yield select();

    if (type === ProjectItemUIType.PAYER) {
      const transactionsByPayer = state.transaction.transactionsByPayer.filter(
        (t) => !transactions.includes(t)
      );
      yield put(
        transactionsActions.transactionsByPayerReceived({
          transactionsByPayer: transactionsByPayer,
        })
      );
    }

    yield put(
      transactionsActions.transactionReceived({ transaction: undefined })
    );
    yield call(deleteTransactionsApi, projectId, transactions);

    const data = yield call(
      fetchTransactions,
      projectId,
      state.transaction.timezone,
      state.transaction.ledgerSummaryType,
      state.transaction.frequencyType,
      state.transaction.startDate,
      state.transaction.endDate
    );
    const ledgerSummary: LedgerSummary = yield data.json();
    yield put(
      transactionsActions.transactionsReceived({
        ledgerSummary: ledgerSummary,
      })
    );
    yield put(transactionsActions.transactionReceived({transaction: undefined}));
    if (state.project.project && ![ProjectItemUIType.LABEL, ProjectItemUIType.TODAY, ProjectItemUIType.RECENT].includes(type)) {
      yield put(projectLabelsUpdate(state.project.project.id, state.project.project.shared));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Delete Transaction Error Received: ${error}`);
    }
  }
}

function* patchTransaction(action: PayloadAction<PatchTransaction>) {
  try {
    const {
      transactionId,
      amount,
      name,
      payer,
      transactionType,
      date,
      time,
      timezone,
      location,
      labels,
      recurrenceRule,
      bankAccountId
    } = action.payload;
    const data = yield call(
      updateTransaction,
      transactionId,
      amount,
      name,
      payer,
      transactionType,
      date,
      time,
      timezone,
      location,
      labels,
      recurrenceRule,
      bankAccountId
    );
    const projectId = data.projectId;
    const state: IState = yield select();
    //update transaction project page's detail transaction
    if (state.transaction.timezone) {
      const updateData = yield call(
        fetchTransactions,
        projectId,
        state.transaction.timezone,
        state.transaction.ledgerSummaryType,
        state.transaction.frequencyType,
        state.transaction.startDate,
        state.transaction.endDate
      );
      const ledgerSummary: LedgerSummary = yield updateData.json();
      yield put(
        transactionsActions.transactionsReceived({
          ledgerSummary: ledgerSummary,
        })
      );
    }

    yield put(
      transactionsActions.transactionReceived({
        transaction: data,
      })
    );
    yield put(
      getProjectItemsAfterUpdateSelect(
        state.myBuJo.todoSelected,
        state.myBuJo.ledgerSelected,
        state.myBuJo.noteSelected,
        'today'
      )
    );

    //update transaction label search page
    const transaction = yield call(getTransactionById, transactionId);
    const labelItems: ProjectItems[] = [];
    state.label.items.forEach((projectItem: ProjectItems) => {
      projectItem = { ...projectItem };
      if (projectItem.transactions) {
        projectItem.transactions = projectItem.transactions.map(
          (eachTransaction) => {
            if (eachTransaction.id === transactionId) return transaction;
            else return eachTransaction;
          }
        );
      }
      labelItems.push(projectItem);
    });
    yield put(updateItemsByLabels(labelItems));
    if (state.project.project) {
      yield put(projectLabelsUpdate(state.project.project.id, state.project.project.shared));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Patch Transaction Error Received: ${error}`);
    }
  }
}

function* transactionSetLabels(action: PayloadAction<SetTransactionLabels>) {
  try {
    const { transactionId, labels } = action.payload;
    const data = yield call(setTransactionLabels, transactionId, labels);
    yield put(transactionsActions.transactionReceived({ transaction: data }));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `transactionSetLabels Error Received: ${error}`);
    }
  }
}

function* createTransactionContent(action: PayloadAction<CreateContent>) {
  try {
    const { transactionId, text } = action.payload;
    const content: Content = yield call(addContent, transactionId, text);
    yield put(updateTransactionContents(transactionId));
    yield put(updateTargetContent(content));

  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(
          message.error,
          `createTransactionContent Error Received: ${error}`
      );
    }
  }
}

function* transactionContentsUpdate(
  action: PayloadAction<UpdateTransactionContents>
) {
  try {
    const {transactionId, updateDisplayMore} = action.payload;
    const contents: Content[] = yield call(getContents, transactionId);
    yield put(
      transactionsActions.transactionContentsReceived({
        contents: contents,
      })
    );

    let targetContent = undefined;
    if (contents && contents.length > 0) {
      const state: IState = yield select();
      targetContent = contents[0];
      if (state.content.content && state.content.content.id) {
        const found = contents.find((c) => c.id === state.content.content!.id);
        if (found) {
          targetContent = found;
        }
      }
    }
    yield put(updateTargetContent(targetContent));

    if (updateDisplayMore === true) {
      yield put(setDisplayMore(true));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else if (error.message === '404') {
      console.log(`transaction ${action.payload.transactionId} not found`);
    } else {
      yield call(
          message.error,
          `transactionContentsUpdate Error Received: ${error}`
      );
    }
  }
}

function* transactionContentRevisionUpdate(
  action: PayloadAction<UpdateTransactionContentRevision>
) {
  try {
    const { transactionId, contentId, revisionId } = action.payload;
    const state: IState = yield select();

    const targetContent: Content = state.transaction.contents.find(
      (c) => c.id === contentId
    )!;
    const revision: Revision = targetContent.revisions.find(
      (r) => r.id === revisionId
    )!;

    if (!revision.content) {
      const data = yield call(
        getContentRevision,
        transactionId,
        contentId,
        revisionId
      );

      const transactionContents: Content[] = [];
      state.transaction.contents.forEach((transactionContent) => {
        if (transactionContent.id === contentId) {
          const newRevisions: Revision[] = [];
          transactionContent.revisions.forEach((revision) => {
            if (revision.id === revisionId) {
              revision = { ...revision, content: data.content };
            }
            newRevisions.push(revision);
          });
          transactionContent = {
            ...transactionContent,
            revisions: newRevisions,
          };
        }
        transactionContents.push(transactionContent);
      });

      yield put(
        transactionsActions.transactionContentsReceived({
          contents: transactionContents,
        })
      );
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(
          message.error,
          `transactionContentRevisionUpdate Error Received: ${error}`
      );
    }
  }
}

function* patchContent(action: PayloadAction<PatchContent>) {
  try {
    const { transactionId, contentId, text, diff } = action.payload;
    const state: IState = yield select();
    const order = state.transaction.contents.map(c => c.id);

    const contents : Content[] = yield call(updateContent, transactionId, contentId, text, state.content.content!.etag, diff);
    contents.sort((a: Content, b: Content) => {
      return order.findIndex((o) => o === a.id) - order.findIndex((o) => o === b.id);
    });
    yield put(
      transactionsActions.transactionContentsReceived({
        contents: contents,
      })
    );
    yield put(updateTargetContent(contents.filter(c => c.id === contentId)[0]));

  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Patch Content Error Received: ${error}`);
    }
  }
}

function* deleteTransactionContent(action: PayloadAction<DeleteContent>) {
  try {
    const { transactionId, contentId } = action.payload;
    const data = yield call(deleteContent, transactionId, contentId);
    const contents = yield data.json();
    yield put(
      transactionsActions.transactionContentsReceived({
        contents: contents,
      })
    );
    yield put(updateTargetContent(contents.length > 0 ? contents[0] : undefined));

  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(
          message.error,
          `transactionContentDelete Transaction Error Received: ${error}`
      );
    }
  }
}

function* getTransactionsByPayer(
  action: PayloadAction<GetTransactionsByPayer>
) {
  try {
    const {
      projectId,
      timezone,
      ledgerSummaryType,
      frequencyType,
      startDate,
      endDate,
      payer,
    } = action.payload;
    const data = yield call(
      fetchTransactions,
      projectId,
      timezone,
      ledgerSummaryType,
      frequencyType,
      startDate,
      endDate,
      payer
    );
    const transactionsByPayer = yield data.json();
    yield put(
      transactionsActions.transactionsByPayerReceived({
        transactionsByPayer: transactionsByPayer,
      })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(
          message.error,
          `getTransactionsByPayer Error Received: ${error}`
      );
    }
  }
}

function* updateTransactionColor(
  action: PayloadAction<UpdateTransactionColorAction>
) {
  try {
    const {transactionId, color} = action.payload;
    const data : Transaction = yield call(
      putTransactionColor,
      transactionId,
      color,
    );

    yield put(transactionsActions.transactionReceived({transaction: data}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Set Transaction Color Fail: ${error}`);
    }
  }
}

function* updateTransactionBankAccount(
    action: PayloadAction<UpdateTransactionBankAccountAction>
) {
  try {
    const {transactionId, bankAccount} = action.payload;
    const data : Transaction = yield call(
        putTransactionBankAccount,
        transactionId,
        bankAccount,
    );

    yield put(transactionsActions.transactionReceived({transaction: data}));
    const response = yield call(fetchBankAccounts);
    const bankAccounts : BankAccount[] = yield response.json();
    yield put(
        myselfActions.myselfDataReceived({
          bankAccounts: bankAccounts
        })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Set Transaction Bank Account Fail: ${error}`);
    }
  }
}

function* shareTransactionByEmails(action: PayloadAction<ShareTransactionByEmailAction>) {
  try {
    const {
      transactionId,
      contents,
      emails,
      targetUser,
      targetGroup,
    } = action.payload;
    yield call(
      shareTransactionByEmail,
      transactionId,
      contents,
      emails,
      targetUser,
      targetGroup,
    );
    yield call(message.success, 'Email sent');
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Transaction Share By Email Error Received: ${error}`);
    }
  }
}

function* changeAccountBalance(action: PayloadAction<ChangeBankAccountBalanceAction>) {
  try {
    const {
      bankAccount,
      balance,
      description,
      onSuccess
    } = action.payload;
    yield call(
        setAccountBalance,
        bankAccount.id,
        balance,
        description
    );
    const state: IState = yield select();
    const accounts = [] as BankAccount[];
    state.myself.bankAccounts.forEach(account => {
      if (account.id === bankAccount.id) {
        const tmp = {...account};
        tmp.netBalance = balance;
        accounts.push(tmp);
      } else {
        accounts.push(account);
      }
    });
    yield put(
        myselfActions.myselfDataReceived({
          bankAccounts: accounts
        })
    );
    yield call(message.success, `Balance is changed to ${balance} for account '${bankAccount.name}'`);
    onSuccess();
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `changeAccountBalance Error Received: ${error}`);
    }
  }
}

function* getBankAccountTransactions(action: PayloadAction<GetBankAccountTransactionsAction>) {
  try {
    const state: IState = yield select();
    const timezone = state.myself.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const {
      bankAccountId,
      startDate,
      endDate
    } = action.payload;
    const data : TransactionView[] = yield call(
        fetchBankAccountTransactions,
        bankAccountId,
        timezone,
        startDate,
        endDate
    );
    yield put(transactionsActions.bankAccountTransactionsReceived({transactions: data}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `getBankAccountTransactions Error Received: ${error}`);
    }
  }
}

export default function* transactionSagas() {
  yield all([
    yield takeLatest(
      transactionsActions.transactionApiErrorReceived.type,
      transactionApiErrorReceived
    ),
    yield takeLatest(
      transactionsActions.TransactionsUpdate.type,
      transactionsUpdate
    ),
    yield takeLatest(
      transactionsActions.TransactionsCreate.type,
      transactionCreate
    ),
    yield takeLatest(transactionsActions.TransactionGet.type, getTransaction),
    yield takeLatest(
      transactionsActions.TransactionPatch.type,
      patchTransaction
    ),
    yield takeLatest(transactionsActions.TransactionMove.type, transactionMove),
    yield takeLatest(
      transactionsActions.TransactionShare.type,
      shareTransaction
    ),
    yield takeLatest(
      transactionsActions.TransactionDelete.type,
      deleteTransaction
    ),
    yield takeLatest(
      transactionsActions.TransactionsDelete.type,
      deleteTransactions
    ),
    yield takeLatest(
      transactionsActions.TransactionSetLabels.type,
      transactionSetLabels
    ),
    yield takeLatest(
      transactionsActions.TransactionContentsUpdate.type,
      transactionContentsUpdate
    ),
    yield takeLatest(
      transactionsActions.TransactionContentRevisionUpdate.type,
      transactionContentRevisionUpdate
    ),
    yield takeLatest(
      transactionsActions.TransactionContentCreate.type,
      createTransactionContent
    ),
    yield takeLatest(
      transactionsActions.TransactionContentPatch.type,
      patchContent
    ),
    yield takeLatest(
      transactionsActions.TransactionContentDelete.type,
      deleteTransactionContent
    ),
    yield takeLatest(
      transactionsActions.getTransactionsByPayer.type,
      getTransactionsByPayer
    ),
    yield takeLatest(
      transactionsActions.updateTransactionColor.type, 
      updateTransactionColor
    ),
    yield takeLatest(
        transactionsActions.updateTransactionBankAccount.type,
        updateTransactionBankAccount
    ),
    yield takeLatest(
      transactionsActions.TransactionShareByEmail.type, 
      shareTransactionByEmails),
    yield takeLatest(
      transactionsActions.RecurringTransactionsUpdate.type,
      recurringTransactionsUpdate),
    yield takeLatest(
        transactionsActions.ChangeBankAccountBalance.type,
        changeAccountBalance),
    yield takeLatest(
        transactionsActions.GetBankAccountTransactions.type,
        getBankAccountTransactions),
  ]);
}
