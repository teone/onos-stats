import { combineReducers } from 'redux'
import { GET_DAILY_COMMITS, RECEIVE_DAILY_COMMITS, PARSE_DAILY_COMMITS, FILTER_COMMIT_BY_MODULE, FILTER_COMMIT_BY_DATE, RESET_COMMIT_DATE_FILTER} from '../actions/actions.js';
import _ from 'lodash';
import {colors} from '../config/chart.js';
import moment from 'moment';

const dailyCommitsStore = {
  isFetching: false,
  isParsing: false,
  totalCommit: null,
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
  const byDomain = _.groupBy(commits, 'company');
  const total = commits.length;
  return _.sortBy(Object.keys(byDomain)
    .reduce((list, item, i) => {
      list.push({
        label: item,
        value: Math.round(((100 * byDomain[item].length) / total) * 100) / 100,
        total: byDomain[item].length,
        id: i,
        color: colors[i]
      });
      return list;
    }, []), 'value').reverse();
}

const findDate = _.memoize((commits, limit) => {
  const flatten = _.pluck(commits, 'date').map(date => moment(date));
  switch(limit){
    case 'MAX':
      return _.max(flatten);
    case 'MIN':
      return _.min(flatten);
  }
}, (a,b) => `${b}_${a.length}`);

function listModules(commits){
  const byModule = _.groupBy(commits, 'module');
  return _.sortBy(
    [
      {label: 'All', value: commits.length, id: 0}, 
      ...Object.keys(byModule)
      .reduce((list, item, i) => {
        list.push({
          label: item,
          value: byModule[item].length,
          id: i + 1,
          color: colors[i]
        });
        return list;
      }, [])
    ], 'value'
    ).reverse();
}

// Filter functions and combination between them
// Memoize these methods
const filterByModule = _.memoize(
  (module, list) => {
    if(module !== 'All'){
      return _.filter(list, {module: module})
    }
    return list;
  },
  (a,b) => `${b}_${a}`
);

const filterByDate = _.memoize((list, minDate, maxDate) => {
  return _.filter(list, (item) => {
    return moment(item.date).toDate() >= minDate && moment(item.date).toDate() <= maxDate;
  });
}, (a,b,c) => `${b}_${c}_${a.length}`);

const applyModuleFilter = (list, minDate, maxDate, module) => {
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
      // NOTE UI is not updating
      return Object.assign({}, state, {
        isFetching: false,
        isParsing: true,
      });
    case PARSE_DAILY_COMMITS:
      return Object.assign({}, state, {
        isParsing: false,
        totalCommit: action.data.length,
        data: parseDailyCommits(action.data),
        minDate: findDate(action.data, 'MIN'),
        maxDate: findDate(action.data, 'MAX'),
        firstDate: findDate(action.data, 'MIN'),
        lastDate: findDate(action.data, 'MAX'),
        modules: listModules(action.data),
        response: action.data
      });
    case FILTER_COMMIT_BY_MODULE:
      return Object.assign({}, state, {
        data: parseDailyCommits(applyModuleFilter(state.response, state.minDate.toDate(), state.maxDate.toDate(), action.data.id)),
        selectedModule: action.data.id,
        minDate: findDate(applyModuleFilter(state.response, state.minDate.toDate(), state.maxDate.toDate(), action.data.id), 'MIN'),
        maxDate: findDate(applyModuleFilter(state.response, state.minDate.toDate(), state.maxDate.toDate(), action.data.id), 'MAX')
      });
    case FILTER_COMMIT_BY_DATE:
      return Object.assign({}, state, {
        data: parseDailyCommits(applyDateFilter(state.response, action.data.minDate.toDate(), action.data.maxDate.toDate(), state.selectedModule)),
        minDate: action.data.minDate,
        maxDate: action.data.maxDate
      });
    case RESET_COMMIT_DATE_FILTER:
      return Object.assign({}, state, {
        minDate: state.firstDate,
        maxDate: state.lastDate
      });
    default:
      return state
  }
}

const rootReducer = combineReducers({
  dailyCommits
})

export default rootReducer;