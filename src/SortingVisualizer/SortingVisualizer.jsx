import React from "react";
import { mergeSortFunc, mergeSortFuncRender, createValueBars, ValueBar } from "../SortingAlgorithms/SortingAlgorithms";
import './SortingVisualizer.css';

const defaultColor = 'blue';
const comparingColor = 'red';
const renderer = 5.5;

export default class SortingVisualizer extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this)

      this.state = {
        array: [],
        amount_of_bars: 95,
        bars_width: .4
      };
      this.animation_speed = 10;
    }

    componentDidMount(){
      this.resetArray();
    }
  
    resetArray(){
      const array = [];
      for (let i = 0; i<this.state.amount_of_bars; i++) {
        let value = randomIntFromInterval(5,450);
        array.push(value);
      }
      this.setState({array});
    }
    
    renderAnimations(animations) {
      let animations_array = animations.animations_array;
      let len = animations_array.length;
      const arraybars = document.getElementsByClassName("array-bar");
      for(let i=0; i<len; i++) {
        let animation = animations_array[i];
        if (animation.type === 'compare') {
          const bar1Style = arraybars[animation.items[0].index].style;
          const bar2Style = arraybars[animation.items[1].index].style;
          setTimeout(() => {
            console.log("Iteration: "+i);
            bar1Style.backgroundColor = comparingColor;
            bar2Style.backgroundColor = comparingColor;
            }, i * this.animation_speed
          )
        }
        else if (animation.type === 'setDefaultColor'){
          const bar1Style = arraybars[animation.items[0].index].style;
          const bar2Style = arraybars[animation.items[1].index].style;
          setTimeout(() => {
            console.log("Iteration: "+i);
            bar1Style.backgroundColor = defaultColor;
            bar2Style.backgroundColor = defaultColor;
          }, i * this.animation_speed)
        }
        else if (animation.type === 'swap') {
          const bar1Style = arraybars[animation.items[0].index].style;
          const bar2Style = arraybars[animation.items[1].index].style;
          let height1 = animation.items[0].value;
          let height2 = animation.items[1].value;
          setTimeout(() => {
            console.log("Iteration: "+i);
            bar1Style.height = `${height2/renderer}vh`;
            bar2Style.height = `${height1/renderer}vh`;
          }, i * this.animation_speed)
        }
        else if (animation.type === "override") {
          let item1 = animation.items[0];
          let item2 = animation.items[1];
          let drift_array = animation.drift_array;
          let lastindex = item2.index;
          let startindex = item1.index;
          let bar1Style = arraybars[item1.index].style;
          let height = item2.value;
          //Array containing all heights of bars going to drift right 1 index
          let arraybarsvalues = [];
          for(let j=0; j<drift_array.length; j++){
            arraybarsvalues.push(drift_array[j].value);
          }
          setTimeout(() => {
            console.log("Iteration: "+i);
            console.log(startindex, lastindex)
            for(let k=startindex, l=0; k<lastindex; k++){
              bar1Style.height = `${height/renderer}vh`;
              let barStyle = arraybars[k+1].style;
              barStyle.height = `${arraybarsvalues[l]/renderer}vh`;
              l++; 
            }
          }, i * this.animation_speed)
        }
      }
    }

    mergeSort(){
      this.animations = new Animations();
      //This functions returns all animations within the animations object
      mergeSortFuncRender(this.state.array, createValueBars(this.state.array), this.animations);
      this.renderAnimations(this.animations);
    }

    handleChange(){
      let value = document.getElementById("adjusting-bar").value;
      let bars_width = width_interpolation(value);
      console.log(bars_width);
      let amount_of_bars = value;
      this.setState((props) => {
        return { amount_of_bars: amount_of_bars
                  }
      })
      let bars = document.getElementsByClassName("array-bar")
      for(let i=0; i<bars.length; i++){
        bars[i].style.width = `${40/bars.length}%`;
        //console.log(bars[i].style)
      }
      //bar_style.width = bars_width;
      this.animation_speed = speed_interpolation(value)
      
      this.resetArray()

    }

    render(){
      const {array} = this.state;
      return (<div className="application">
        <div className="array-container">
        {array.map((value, idx) => (
          <div className="array-bar" key={idx} style={{height: `${Math.floor(value/renderer)}vh`}}>
          </div>
        ))}
        </div>
        <div id="interface">
            <div className="button-container">
              <button id="new-array-button" onClick={() => this.resetArray()}>Generate new array</button>
            </div>
            <div className="separator"></div>
            <div className="adjusting-bar-container">
              <input type="range" min="6" max="95" id="adjusting-bar" onChange={this.handleChange}/>
            </div> 
            <div className="separator"></div>
            <div className="button-container">
              <button onClick={() => this.mergeSort()}>Merge Sort</button>
            </div>
        </div>
        </div>
      )}
  }
  
  function Animation(type, items, optionalDriftArray) {
    this.type = type;
    this.items = items;
    this.drift_array = optionalDriftArray;
  }
  function Animations() { // This object contains all of "Animation" objects.
    this.animations_array = [];
    this.swapItems = function(item1, item2) {
      this.animations_array.push(new Animation("swap", [new ValueBar(item1.value, item1.index), new ValueBar(item2.value, item2.index)]));
    };
    this.compareItems = function(item1, item2) {
      this.animations_array.push(new Animation("compare", [new ValueBar(item1.value, item1.index), new ValueBar(item2.value, item2.index)]));
      this.animations_array.push(new Animation("setDefaultColor", [new ValueBar(item1.value, item1.index), new ValueBar(item2.value, item2.index)]))
    };
    this.overrideItems = function(item1, item2, arrayOfItemsToDrift) {
      this.animations_array.push(new Animation("override", [new ValueBar(item1.value, item1.index), new ValueBar(item2.value, item2.index)], copyArrayOfValueBars(arrayOfItemsToDrift)))
    }
  }

  function randomIntFromInterval(min, max) {
    //min and max inclusive
    return Math.floor(Math.random()*(max-min+1) + min)
  }

  function areArraysEqual(array1, array2) {
    let result = true;
    if (array1.length === array2.length) {
      for(let i=0; i<array1.length; i++){
        if (array1[i] !== array2[i]) {
          result = false;
          break;
        }
      }
    }
    else result = false;
    return result;
  }

  function convertObjectsArrayToIntsArray(objects_array){
    let newArray = []
    objects_array.forEach(element => {
      newArray.push(element.value);
    });
    return newArray;
  }

  function copyArrayOfValueBars(arrayOfValueBars){
    let newArray = []
    for(let i=0; i<arrayOfValueBars.length; i++){
      let value_bar = arrayOfValueBars[i];
      newArray.push(new ValueBar(value_bar.value, value_bar.index));
    }
    console.log(newArray);
    return newArray;
  }


  function width_interpolation(x){
    let x1 = 6;
    let x2 = 95;
    let y1 = 4.2;
    let y2 = .5;
    //let result = y1 + (((x-x1)/(x2-x1))*(y2-y1));
    let result = 20/x
    return result;
  }

  function speed_interpolation(x){
    let x1 = 6;
    let x2 = 95;
    let y1 = 500;
    let y2 = 10;
    return y1 + (((x-x1)/(x2-x1))*(y2-y1));
  }