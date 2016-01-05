import { combineReducers } from 'redux'
import { GET_DAILY_COMMITS, RECEIVE_DAILY_COMMITS, FILTER_COMMIT_BY_MODULE, FILTER_COMMIT_BY_DATE} from '../actions/actions.js';
import _ from 'lodash';
import {colors} from '../config/chart.js';
import moment from 'moment';

const dailyCommitsStore = {
  isFetching: false,
  response: [],
  data: [],
  minDate: null, // filtering start date
  maxDate: null, // filtering end date
  modules: [],
  selectedModule: 'All',
  firstDate: null, // first and last available date for commits
  lastDate: null // first and last available date for commits
};

function parseDailyCommits(commits) {
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
  const flatten = _.pluck(commits, 'date').map(date => moment(date));
  switch(limit){
    case 'MAX':
      return _.max(flatten);
    case 'MIN':
      return _.min(flatten);
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

// Filter functions and combination between them

const filterByModule = (module, list) => {
  if(module !== 'All'){
    return _.filter(list, {module: module})
  }
  return list;
};

function filterByDate(list, minDate, maxDate){
  return _.filter(list, (item) => {
    return moment(item.date).toDate() >= minDate && moment(item.date).toDate() <= maxDate;
  });
}

const applyModuleFilter = (list, minDate, maxDate, module) => {
  console.log(list, minDate, maxDate, module);
  return filterByDate(filterByModule(module, list), minDate, maxDate);
}

const applyDateFilter = (list, minDate, maxDate, module) => {
  return filterByModule(module, filterByDate(list, minDate, maxDate));
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
        maxDate: findDate('MAX', action.data),
        firstDate: findDate('MIN', action.data),
        lastDate: findDate('MAX', action.data),
        modules: listModules(action.data),
        response: action.data
      });
    case FILTER_COMMIT_BY_MODULE:
      return Object.assign({}, state, {
        data: parseDailyCommits(applyModuleFilter(state.response, state.minDate.toDate(), state.maxDate.toDate(), action.data.id)),
        selectedModule: action.data.id,
        minDate: findDate('MIN', applyModuleFilter(state.response, state.minDate.toDate(), state.maxDate.toDate(), action.data.id)),
        maxDate: findDate('MAX', applyModuleFilter(state.response, state.minDate.toDate(), state.maxDate.toDate(), action.data.id))
      });
    case FILTER_COMMIT_BY_DATE:
      return Object.assign({}, state, {
        data: parseDailyCommits(applyDateFilter(state.response, action.data.minDate.toDate(), action.data.maxDate.toDate(), state.selectedModule)),
        minDate: action.data.minDate,
        maxDate: action.data.maxDate
      });
    default:
      return state
  }
}

const rootReducer = combineReducers({
  dailyCommits
})

export default rootReducer;