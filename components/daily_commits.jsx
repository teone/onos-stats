import React from 'react';
import { connect } from 'react-redux';
import { Pie as PieChart } from 'react-chartjs';

const DailyCommits = ({dailyCommits}) => (
  <div>
    <h1>Todos</h1>
    {dailyCommits.isFetching ? 'loading':null}
    {dailyCommits.rows.map(item => <p key={item.id}>{item.label} - {item.value}</p>)}
    <PieChart data={dailyCommits.rows} options={dailyCommits.options}/>
  </div>
)

function mapStateToProps(store) {
  const dailyCommits = store.dailyCommits;
  return {
    dailyCommits
  }
}

export default connect(mapStateToProps)(DailyCommits)