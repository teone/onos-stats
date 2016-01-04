import { combineReducers } from 'redux'
import { GET_DAILY_COMMITS, RECEIVE_DAILY_COMMITS} from '../actions/actions.js';

const dailyCommitsStore = {
  isFetching: false,
  data: []
};

function dailyCommits(state = dailyCommitsStore, action){
  switch(action.type) {
    case GET_DAILY_COMMITS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_DAILY_COMMITS:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.data
      });
    default:
      return state
  }
}

const rootReducer = combineReducers({
  dailyCommits
})

export default rootReducer;