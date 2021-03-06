import React, { Component } from 'react';
import './App.css';
import Voters from './Voters.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      candidates: [0, 0],
      max: 100
    };
  }

  sortedCandidates(arr) {
    return arr.slice(0).sort((a, b) => {
      return a - b;
    });
  }

  halfBetween(a, b) {
    return (a + b) / 2;
  }

  getPrevUnique(arr, index, value) {
    let prevIndex = index - 1;
    while(prevIndex >= 0 && arr[prevIndex] === value) {
      prevIndex--;
    }
    return prevIndex >= 0 ? arr[prevIndex] : null;
  }

  getNextUnique(arr, index, value) {
    let lastIndex = (arr.length - 1);
    let nextIndex = index + 1;
    while(nextIndex <= lastIndex && arr[nextIndex] === value) {
      nextIndex++;
    }
    return nextIndex <= lastIndex ? arr[nextIndex] : null;
  }

  countOccurences(arr, value) {
    return arr.filter(item => {
      return item === value;
    }).length;
  }

  isDominantStrategy(candidates, currentIndex, testValue) {
    let bestOutcome = 0;
    let bestOut = null;
    let bestIndex = -1;
    let testCandidates = candidates.slice(0);
    for(var i = 0; i < this.state.max; i++) {
      testCandidates[currentIndex] = i;
      let anotherOutcome = this.collectVotes(testCandidates, i);
      if(anotherOutcome.individualVotes > bestOutcome) {
        bestOutcome = anotherOutcome.individualVotes;
        bestOut = anotherOutcome;
        bestIndex = i;
      }
    }
    return bestOutcome === testValue;
  }

  collectVotes(candidates, value) {
    let start;
    let end;
    let sorted = this.sortedCandidates(candidates);
    let tied = this.countOccurences(sorted, value);
    let max = this.state.max;
    let individualVotes;
    let sharedVotes;
    sorted.forEach((candidate, index) => {
      if(candidate === value) {
        let prev = this.getPrevUnique(sorted, index, value);
        let next = this.getNextUnique(sorted, index, value);
        start = prev !== null ? this.halfBetween(prev, candidate) : 0;
        end = next !== null ? this.halfBetween(candidate, next) : max;
      }
    });
    sharedVotes = end - start;
    individualVotes = tied ? (sharedVotes / tied) : 1;

    return {start, sharedVotes, individualVotes, tied};
  }

  changePosition(index, event) {
    let candidates = this.state.candidates;
    candidates[index] = Number(event.target.value);
    this.setState({candidates});
  }

  candidatesToRender() {
    return this.state.candidates.map((candidate, index) => {
      let position = candidate;
      let result = this.collectVotes(this.state.candidates, candidate);
      let start = result.start;
      let sharedVotes = result.sharedVotes;
      let individualVotes = result.individualVotes;
      let height = result.tied ? 1 / result.tied : 1;
      let isDominantStrategy = this.isDominantStrategy(this.state.candidates, index, result.individualVotes);
      return {position, result, start, sharedVotes, individualVotes, height, isDominantStrategy};
    });
  }

  isInEquilibrium(candidates) {
    return candidates.filter(candidate => {
      return candidate.isDominantStrategy;
    }).length === candidates.length;
  }

  updateNumCandidates(e) {
    let newValue = e.target.value;
    if(newValue > 0) {
      this.resetCandidates(newValue);
    }
  }

  resetCandidates(count) {
    let candidates = [];
    for(var i = 0; i < count; i++) {
      candidates.push(0);
    }
    this.setState({candidates});
  }

  updatePrecision(e) {
    let newValue = e.target.value;
    if(newValue > 0) {
      this.setState({max: newValue});
    }
  }

  render() {
    let candidates = this.candidatesToRender();
    let isInEquilibrium = this.isInEquilibrium(candidates);
    let equilibriumSymbol = isInEquilibrium ? '✓' : '✕';
    let equilibriumColor = isInEquilibrium ? '#2ded2a' : '#ed3629';
    let equilibriumStyle = {color: equilibriumColor};
    return (
      <div className="App">
        <h3 className="equilibrium">
          Equilibrium?&nbsp;
          <span style={equilibriumStyle}>{equilibriumSymbol}</span>
        </h3>
        <div className="settings">
          Number of candidates:&nbsp;
          <input type="number" min="1" max="32" onChange={this.updateNumCandidates.bind(this)} defaultValue="2" />
          <br />
          Precision:&nbsp;
          <input type="number" min="1" max="1000" onChange={this.updatePrecision.bind(this)} defaultValue="100" />
        </div>
        {
          candidates.map((candidate, index) => {
            let max = this.state.max;
            let step = 1;
            return (<Voters key={index} index={index} position={candidate.position} start={candidate.start} sharedVotes={candidate.sharedVotes} individualVotes={candidate.individualVotes} isDominantStrategy={candidate.isDominantStrategy} height={candidate.height} max={max} step={step} onChange={this.changePosition.bind(this)} />);
          })
        }
        <div className="about">
          <h3>About this widget</h3>
          <p>
            The purpose of this widget is to provide a visual aid for intuitive reasoning about a concept known as the <em>median voter theorem</em>.
            &nbsp;<a href="https://en.wikipedia.org/wiki/Median_voter_theorem">Wikipedia</a> provides some information about the concept.
            This particular widget pertains to a <a href="https://en.wikipedia.org/wiki/Game_theory">game theoretic</a> analysis of this concept. The game portrayed here is described as follows:
          </p>
          <ul>
            <li>The candidates are the players, and they are competing for votes.</li>
            <li>Each candidate is attempting to maximize the number of votes she receives.</li>
            <li>Each voter votes for the candidate which is closest to his position.</li>
            <li>The voters are assumed to be equally distributed along a one-dimensional political spectrum.</li>
          </ul>
          <p>
            An analysis of this game reveals that the solution depends on the number of candidates involved, and that there may not be an equilibrium at all (for example, when there are 3 candidates).
            It's worth noting that this is a very simplistic model and it is probably more of mathematical interest than practical use.
          </p>
          <p>
            Go ahead, try it out! See if you can find an equilibrium in the 2-candidate game, and then try increasing the number of candidates.
          </p>
        </div>
      </div>
    );
  }
}

export default App;
