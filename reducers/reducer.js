import { combineReducers } from 'redux'
import { GET_DAILY_COMMITS, RECEIVE_DAILY_COMMITS} from '../actions/actions.js';
import _ from 'lodash';
import {colors} from '../config/chart.js';

const dailyCommitsStore = {
  isFetching: false,
  rows: [],
  options: {
    margin: {top: 20, left: 20, right: 20, bottom: 20},
    width: 600,
    height: 600,
    color: '#2980B9',
    r: 100,
    R: 200,
    legendPosition: 'topLeft',
    animate:{
      type:'oneByOne',
      duration:200,
      fillTransition:3
    },
    label:{
      fontFamily:'Arial',
      fontSize:14,
      fontWeight:true,
      fill:'#ECF0F1'
    }
  }
};

function parseDailyCommits(commits) {
  // TODO
  // [X] group by company
  // [X] count commits per day
  // [ ] filter by module
  // [ ] filter by date (default last month)
  const byDomain = _.groupBy(commits, 'domain');
  return Object.keys(byDomain)
    .reduce((list, item, i) => {
      list.push({
        label: item,
        value: byDomain[item].length,
        id: i,
        color: colors[i]
      });
      return list;
    }, []);
}

function dailyCommits(state = dailyCommitsStore, action){
  switch(action.type) {
    case GET_DAILY_COMMITS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_DAILY_COMMITS:
      return Object.assign({}, state, {
        isFetching: false,
        rows: parseDailyCommits(action.data),
      });
    default:
      return state
  }
}

const rootReducer = combineReducers({
  dailyCommits
})

export default rootReducer;