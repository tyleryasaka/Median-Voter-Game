import React, { Component } from 'react';

const barHeight = 50;

class Voters extends Component {
  constructor(props) {
    super(props);
  }

  asPercent(value, total) {
    return (value / total) * 100;
  }

  render() {
    let max = this.props.max;
    let sharedPercent = this.asPercent(this.props.sharedVotes, max);
    let individualPercent = this.asPercent(this.props.individualVotes, max);
    let style = {
      width: String(sharedPercent) + "%",
      height: String(this.props.height * barHeight) + "px",
      marginLeft: String(this.asPercent(this.props.start, max)) + "%"
    };
    let step = this.props.step;
    let votes = individualPercent.toFixed(2);
    let isBestStrategy = this.props.isDominantStrategy;
    let strategySymbol = isBestStrategy ? '✓' : '✕';
    let strategyColor = isBestStrategy ? '#2ded2a' : '#ed3629';
    let strategyStyle = {color: strategyColor};
    return (
      <div>
        <div className="all-voters">
          <div className="selected-voters" style={style}></div>
        </div>
        <input type="range" defaultValue={this.props.position} max={max} step={step} onChange={this.props.onChange.bind(this, this.props.index)}/>
        <div className="position-display">
          Position: <span className="position-display-value">{this.props.position}</span><br />
          Votes: <span className="position-display-value">{votes}%</span><br />
          Best strategy? <span style={strategyStyle}>{strategySymbol}</span>
        </div>
      </div>
    );
  }
}

export default Voters;
