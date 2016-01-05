import { combineReducers } from 'redux'
import { GET_DAILY_COMMITS, RECEIVE_DAILY_COMMITS, FILTER_COMMIT_BY_MODULE} from '../actions/actions.js';
import _ from 'lodash';
import {colors} from '../config/chart.js';
import moment from 'moment';

const dailyCommitsStore = {
  isFetching: false,
  response: [],
  data: [],
  minDate: null,
  maxDate: null,
  modules: [],
  selectedModule: 'All'
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

function listModules(commits){
  const byModule = _.groupBy(commits, 'module');
  return [{label: 'All', value: commits.length, id: 0}, ...Object.keys(byModule)
    .reduce((list, item, i) => {
      list.push({
        label: item,
        value: byModule[item].length,
        id: i + 1,
        color: colors[i]
      });
      return list;
    }, [])];
}

const filterByModule = _.memoize((module, list) => {
  if(module !== 'All'){
    return _.filter(list, {module: module})
  }
  return list;
});

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
        maxDate: findDate('MAX', action.data),
        modules: listModules(action.data),
        response: action.data
      });
    case FILTER_COMMIT_BY_MODULE:
      return Object.assign({}, state, {
        data: parseDailyCommits(filterByModule(action.data.id, state.response)),
        selectedModule: action.data.id
      });
    default:
      return state
  }
}

const rootReducer = combineReducers({
  dailyCommits
})

export default rootReducer;