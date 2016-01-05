import React from 'react';
import { connect } from 'react-redux';
import { Pie as PieChart } from 'react-chartjs';
import { filterCommitByModule } from '../actions/actions.js';
import classNames from 'classnames';

const DailyCommits = ({dailyCommits, dispatch}) => (
  <div className="row">
    <h1>Commits per day</h1>
    {dailyCommits.isFetching ? 'loading':null}
    <div className="col-sm-6">
      <h2>Companies</h2>
      <ul className="list-group">
        {
          dailyCommits.data.map(item => {
            const style = {background: item.color};
            return <li className="list-group-item" key={item.id}><span className="badge" style={style}>{item.value}</span>{item.label}</li>
          }
        )}
      </ul>
      <h2>Modules</h2>
      {dailyCommits.selectedModule}
      <ul className="list-group">
        {
          dailyCommits.modules.map(module => {
            const classes = classNames({
              'list-group-item': true,
              active: dailyCommits.selectedModule === module.label
            })
            return <li className={classes} 
              key={module.id}
              onClick={() => dispatch(filterCommitByModule(module.label))}>
                <span className="badge">{module.value}</span>
              {module.label}
            </li>
          }
        )}
      </ul>
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