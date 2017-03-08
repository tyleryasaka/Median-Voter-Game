import React, { Component } from 'react';

const barHeight = 50;

class Voters extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let style = {
      width: String(this.props.sharedVotes) + "%",
      height: String(this.props.height * barHeight) + "px",
      marginLeft: String(this.props.start) + "%"
    };
    let max = this.props.max;
    let step = this.props.step;
    let votes = this.props.individualVotes.toFixed(2);
    let isBestStrategy = String(this.props.isDominantStrategy);
    return (
      <div>
        <div className="all-voters">
          <div className="selected-voters" style={style}></div>
        </div>
        <input type="range" defaultValue={this.props.position} max={max} step={step} onChange={this.props.onChange.bind(this, this.props.index)}/>
        <div className="position-display">
          Position: {this.props.position}<br />
          Votes: {votes}%<br />
          Best strategy: {isBestStrategy}
        </div>
      </div>
    );
  }
}

export default Voters;
