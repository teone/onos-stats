import React from 'react';
import { connect } from 'react-redux';
import Chart from 'chart.js';
import { Pie as PieChart } from 'react-chartjs';
import { filterCommitByModule, filterCommitByDate, resetDateFilter } from '../actions/actions.js';
import classNames from 'classnames';
import DatePicker from 'react-datepicker';

require('react-datepicker/dist/react-datepicker.css');
require('../style/commits-per-day.css');

Chart.defaults.global.responsive = true;

const DailyCommits = ({dailyCommits, dispatch}) => (
  <div className="row commits-per-day">
    <h1 className="text-center">Commits per day</h1>
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
      <PieChart data={dailyCommits.data} redraw/>
      <div className="row">
        <div className="col-sm-5">
          <label>Start Date:</label>
          <DatePicker
            selected={dailyCommits.minDate}
            onChange={(date) => dispatch(filterCommitByDate(date, dailyCommits.maxDate))}
            minDate={dailyCommits.firstDate}
            maxDate={dailyCommits.lastDate}/>
        </div>
        <div className="col-sm-5">
          <label>End Date:</label>
          <DatePicker
            selected={dailyCommits.maxDate}
            onChange={(date) => dispatch(filterCommitByDate(dailyCommits.minDate, date))}
            minDate={dailyCommits.firstDate}
            maxDate={dailyCommits.lastDate}/>
        </div>
        <div className="col-sm-2 text-right">
          <a className="btn btn-default reset-date" onClick={() => dispatch(resetDateFilter())}>Reset</a>
        </div>
      </div>
      <div className="row">
        {
          dailyCommits.modules.map(module => {
            const classes = classNames({
              'btn': true,
              'full-width': true,
              'btn-default': dailyCommits.selectedModule !== module.label,
              'btn-primary': dailyCommits.selectedModule === module.label
            })
            return <div className="col-xs-3">
              <a className={classes} 
                key={module.id}
                onClick={() => dispatch(filterCommitByModule(module.label))}>
                  {module.label}
                  <span className="badge">{module.value}</span>
              </a>
            </div>
          }
        )}
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