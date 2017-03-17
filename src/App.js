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
    let isInEquilibrium = String(this.isInEquilibrium(candidates));
    return (
      <div className="App">
        <h3>
          Is in equilibrium? {isInEquilibrium}
        </h3>
        Number of candidates:&nbsp;
        <input type="number" min="1" max="32" onChange={this.updateNumCandidates.bind(this)} defaultValue="2" />
        <br />
        Precision:&nbsp;
        <input type="number" min="1" max="1000" onChange={this.updatePrecision.bind(this)} defaultValue="100" />
        {
          candidates.map((candidate, index) => {
            let max = this.state.max;
            let step = 1;
            return (<Voters key={index} index={index} position={candidate.position} start={candidate.start} sharedVotes={candidate.sharedVotes} individualVotes={candidate.individualVotes} isDominantStrategy={candidate.isDominantStrategy} height={candidate.height} max={max} step={step} onChange={this.changePosition.bind(this)} />);
          })
        }
      </div>
    );
  }
}

export default App;
