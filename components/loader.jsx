import React from 'react';
require('../style/loader.css');

const Loader = () => (
  <div className="loader">{this.props.message}...</div>
  );

const AnotherLoader = React.createClass({
  render: function() {
    return (
      <div>
        <div className="loader">{this.props.message}...</div>
      </div>
    );
  }
});

export default AnotherLoader;