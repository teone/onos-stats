import fetch from 'isomorphic-fetch'

// define action types
export const GET_DAILY_COMMITS = 'GET_DAILY_COMMITS';
export const RECEIVE_DAILY_COMMITS = 'RECEIVE_DAILY_COMMITS';

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

export function fetchDailyCommits() {
  return dispatch => {
    dispatch(getDailyCommits())
    return fetch(`../gitCommitDay.json`)
      .then(response => response.json())
      .then(json => dispatch(receiveDailyCommits(json)))
  }
}