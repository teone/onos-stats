import fetch from 'isomorphic-fetch'

// define action types
export const GET_DAILY_COMMITS = 'GET_DAILY_COMMITS';
export const RECEIVE_DAILY_COMMITS = 'RECEIVE_DAILY_COMMITS';
export const FILTER_COMMIT_BY_MODULE = 'FILTER_COMMIT_BY_MODULE';
export const FILTER_COMMIT_BY_DATE = 'FILTER_COMMIT_BY_DATE';
export const RESET_COMMIT_DATE_FILTER = 'RESET_COMMIT_DATE_FILTER';

// Start the request
export function getDailyCommits() {
  return{
    type: GET_DAILY_COMMITS
  }
}

// dispatch an action when the response arrive
export function receiveDailyCommits(json) {
  return{
    type: RECEIVE_DAILY_COMMITS,
    data: json
  }
}

export function filterCommitByModule(moduleId){
  return{
    type: FILTER_COMMIT_BY_MODULE,
    data: {id: moduleId}
  }
}

export function filterCommitByDate(minDate, maxDate){
  return{
    type: FILTER_COMMIT_BY_DATE,
    data: {minDate: minDate, maxDate: maxDate}
  }
}

export function resetDateFilter(){
  return {
    type: RESET_COMMIT_DATE_FILTER
  }
}

export function fetchDailyCommits() {
  return dispatch => {
    dispatch(getDailyCommits())
    return fetch(`../gitCommitDay.json`)
      .then(response => response.json())
      .then(json => dispatch(receiveDailyCommits(json)))
  }
}