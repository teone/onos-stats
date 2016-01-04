import { combineReducers } from 'redux'
import { GET_DAILY_COMMITS, RECEIVE_DAILY_COMMITS} from '../actions/actions.js';
import _ from 'lodash';
import {colors} from '../config/chart.js';
import moment from 'moment';

const dailyCommitsStore = {
  isFetching: false,
  data: [],
  minDate: null,
  maxDate: null
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

function findDate(limit, commits){
  // const flatten = _.pluck(commits, 'date').map(date => new Date(date));
  const flatten = _.pluck(commits, 'date').map(date => moment(date));
  switch(limit){
    case 'MAX':
      return _.max(flatten).format('MMMM Do YYYY');
    case 'MIN':
      return _.min(flatten).format('MMMM Do YYYY');
  }
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
        data: parseDailyCommits(action.data),
        minDate: findDate('MIN', action.data),
        maxDate: findDate('MAX', action.data)
      });
    default:
      return state
  }
}

const rootReducer = combineReducers({
  dailyCommits
})

export default rootReducer;