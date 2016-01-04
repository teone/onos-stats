import React from 'react';
import { connect } from 'react-redux';

const DailyCommits = ({dailyCommits}) => (
  <div>
    <h1>Todos</h1>
    {dailyCommits.map(item => <p key={item.id}>{item.dev_name}</p>)}
  </div>
)

function mapStateToProps(store) {
  const dailyCommits = store.dailyCommits.data;
  console.log('DAILY COMMITS', dailyCommits);
  return {
    dailyCommits
  }
}

export default connect(mapStateToProps)(DailyCommits)