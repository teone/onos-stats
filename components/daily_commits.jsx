import React from 'react';
import { connect } from 'react-redux';
import Chart from 'chart.js';
import { Pie as PieChart } from 'react-chartjs';
import { filterCommitByModule, filterCommitByDate, resetDateFilter } from '../actions/actions.js';
import classNames from 'classnames';
import DatePicker from 'react-datepicker';
import Loader from './loader.jsx';

require('react-datepicker/dist/react-datepicker.css');
require('../style/commits-per-day.css');

Chart.defaults.global.responsive = true;

const DailyCommits = ({dailyCommits, dispatch}) => (
  <div className="row commits-per-day">
    <div>{dailyCommits.isFetching ? <Loader message="Loading data"/>:null}</div>
    <div>{dailyCommits.isParsing ? <Loader message="Parsing data"/>:null}</div>
    <section style={{visibility: dailyCommits.isFetching || dailyCommits.isParsing ? 'hidden':'visible'}}>
      <h1 className="text-center">Commits Statistics</h1>
      <div className="col-sm-6 company-container">
        <h2>Companies - <i>{dailyCommits.totalCommit} Commits</i></h2>
        <ul className="list-group">
          {
            dailyCommits.data.map(item => {
              const style = {background: item.color};
              return <li className="list-group-item" key={item.id}>
                  <span className="badge" style={style}>{item.value}%</span>
                  {item.label} - <i>{item.total} Commits</i>
                </li>
            }
          )}
        </ul>
      </div>
      <div className="col-sm-6">
        <div className="row">
          <div className="col-sm-12 chart-container">
            <PieChart data={dailyCommits.data} options={{segmentShowStroke: true, segmentStrokeWidth: 0.5, tooltipTemplate: '<%if (label){%><%=label%>: <%}%><%= value %>%'}} width="60" height="60" redraw/>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4">
            <label>Start Date:</label>
            <DatePicker
              selected={dailyCommits.minDate}
              onChange={(date) => dispatch(filterCommitByDate(date, dailyCommits.maxDate))}
              minDate={dailyCommits.firstDate}
              maxDate={dailyCommits.lastDate}/>
          </div>
          <div className="col-sm-4">
            <label>End Date:</label>
            <DatePicker
              selected={dailyCommits.maxDate}
              onChange={(date) => dispatch(filterCommitByDate(dailyCommits.minDate, date))}
              minDate={dailyCommits.firstDate}
              maxDate={dailyCommits.lastDate}/>
          </div>
          <div className="col-sm-4 text-right">
            <a className="btn btn-default reset-date" onClick={() => dispatch(resetDateFilter())}>Reset</a>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 module-container">
            <label>Modules:</label>
          </div>
          {
            dailyCommits.modules.map(module => {
              const classes = classNames({
                'btn': true,
                'full-width': true,
                'module-selector': true,
                'btn-default': dailyCommits.selectedModule !== module.label,
                'btn-primary': dailyCommits.selectedModule === module.label
              })
              return <div className="col-xs-6 col-sm-4 col-lg-3">
                <div className={classes} 
                  key={module.id}
                  onClick={() => dispatch(filterCommitByModule(module.label))}>
                    {module.label}
                </div>
              </div>
            }
          )}
        </div>
      </div>
    </section>
  </div>
)

function mapStateToProps(store) {
  const dailyCommits = store.dailyCommits;
  console.log(dailyCommits);
  return {
    dailyCommits
  }
}

export default connect(mapStateToProps)(DailyCommits)