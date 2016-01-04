import React from 'react';
import { connect } from 'react-redux';
import { Pie as PieChart } from 'react-chartjs';

const DailyCommits = ({dailyCommits}) => (
  <div className="row">
    <h1>Commits per day</h1>
    {dailyCommits.isFetching ? 'loading':null}
    <div className="col-sm-6">
      {dailyCommits.data.map(item => <p key={item.id}>{item.label} - {item.value}</p>)}
    </div>
    <div className="col-sm-6">
      <PieChart data={dailyCommits.data}/>
      <div>
        From: {dailyCommits.minDate} <br/>
        To: {dailyCommits.maxDate}
      </div>
    </div>
  </div>
)

function mapStateToProps(store) {
  const dailyCommits = store.dailyCommits;
  return {
    dailyCommits
  }
}

export default connect(mapStateToProps)(DailyCommits)