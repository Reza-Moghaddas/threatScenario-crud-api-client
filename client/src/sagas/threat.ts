import { delay, put, call, takeEvery } from 'redux-saga/effects';
import * as actionType from '../global/actions';
import actions from '../actions/threat';
import { apiCalls } from '../global/Api';
import { toast } from 'react-toastify';

/** *************************** Subroutines ************************************/
function* createThreat(option: any) {
  const { title, listId, tempId } = option;
  yield put(actions.createThreatRequest({ title, tempId }));
  try {
    const { response, error } = yield call(apiCalls.createThreat, {
      title,
      listId
    });
    if (response) {
      yield put(actions.createThreatSuccess(response, tempId));
      toast.success('Item created successfully!');
    } else {
      toast.error(`we are gonna retry because of ${error.message}`);
      yield delay(5000);
      yield put(actions.createThreat({ title, listId, tempId }));
    }
  } catch (error) {
    toast.error(`${error.message}`);
  }
}

function* deleteItem(option: any) {
  const { id: itemId, listId } = option;
  yield put(actions.deleteThreatRequest());
  try {
    const { response, error } = yield call(apiCalls.deleteThreat, {
      listId,
      itemId
    });
    if (response) {
      yield put(actions.deleteThreatSuccess(response, itemId));
      toast.success('Item deleted successfully!');
    } else {
      toast.error(`we are gonna retry because of ${error.message}`);
      yield delay(5000);
      yield put(actions.deleteThreat({ id: itemId, listId }));
    }
  } catch (error) {
    toast.error(`${error.message}`);
  }
}

function* updateThreat(option: any) {
  const { itemId, listId, index } = option;
  yield put(actions.updateThreatRequest(itemId, index));
  try {
    const { response, error } = yield call(apiCalls.updateThreat, {
      listId,
      itemId,
      index
    });
    if (response) {
      yield put(actions.updateThreatSuccess(response));
      toast.success('Item reOrdered successfully!');
    } else {
      toast.error(`we are gonna retry because of ${error.message}`);
      yield delay(5000);
      yield put(actions.updateThreat({ itemId, listId, index }));
    }
  } catch (error) {
    toast.error(`${error.message}`);
  }
}

function* loadThreats(option: any) {
  yield put(actions.loadThreatsRequest());
  const { listId } = option;
  try {
    const { response, error } = yield call(apiCalls.loadThreats, { id: listId });
    if (response) {
      yield put(actions.loadThreatsSuccess(response));
    } else {
      if (error.message === 'list not found.') {
        toast.error(`We couldn't find the list! please make a new one.`);
        // history.push('/');
        return;
      }
      toast.error(`we are gonna retry because of ${error.message}`);
      yield delay(5000);
      yield put(actions.loadThreats({ listId }));
    }
  } catch (error) {
    toast.error(`${error.message}`);
  }
}
/** ****************************************************************************/
/** ***************************** WATCHERS *************************************/
/** ****************************************************************************/
export default function* watchJob() {
  yield takeEvery(actionType.THREAT_CREATE, createThreat);
  yield takeEvery(actionType.THREAT_DELETE, deleteItem);
  yield takeEvery(actionType.THREAT_UPDATE, updateThreat);
  yield takeEvery(actionType.THREATS_LOAD, loadThreats);
}