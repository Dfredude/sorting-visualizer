import React from "react";
import { selectionSortRender, mergeSortFuncRender, createValueBars, ValueBar } from "../SortingAlgorithms/SortingAlgorithms";
import './SortingVisualizer.css';

const defaultColor = 'blue';
const comparingColor = 'red';
const renderer = 4;

export default class SortingVisualizer extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this)

      this.state = {
        array: [],
        bars_width: .4
      };
      this.amount_of_bars = 95;
      this.animation_speed = 10;
      this.running = false;
      this.ran = false;
      this.changed = false;
      this.status_bar_values_text = false;
    }

    componentDidMount(){
      this.resetArray();
    }
    
    componentDidUpdate(){
      if (this.changed=== true){
        const bars = document.getElementsByClassName("array-bar");
        const new_width = 40/bars.length;
        for(let i=0; i<bars.length; i++){
          bars[i].style.width = `${new_width}%`;
        }
        if (this.amount_of_bars < 13){
          let bar_texts = document.getElementsByClassName("array-bar-text");
          for (let i=0; i<bar_texts.length; i++){
            bar_texts[i].textContent = this.state.array[i];
          }
          this.status_bar_values_text = true;
        }
      this.changed = false;
      }
    }

    resetArray(){
      const array = [];
      if (this.ran === true){
        this.ran = false;
        this.resetColors();
        this.enableInterface();
      }
      for (let i = 0; i<this.amount_of_bars; i++) {
        let value = randomIntFromInterval(15,300);
        array.push(value);
      }
      this.setState({array});
      if (this.status_bar_values_text){
        if (this.amount_of_bars > 12){
          let bar_texts = document.getElementsByClassName("array-bar-text");
          let bars = document.getElementsByClassName("array-bar");
          for (let i=0; i<bar_texts.length; i++){
            bar_texts[i].textContent = null;
          }
        }
      }
      this.changed = true;
    }

    resetColors(){
      let bars = document.getElementsByClassName("array-bar")
      for(let i=0; i<bars.length; i++){
        bars[i].style.backgroundColor = defaultColor;
      }
    }
    
    renderAnimations(animations) {
      let animations_array = animations.animations_array;
      let len = animations_array.length;
      const arraybars = document.getElementsByClassName("array-bar");
      for(let i=0; i<len; i++) {
        let animation = animations_array[i];
        if (i === len-1) {
          setTimeout(() => {
            this.running = false;
            this.ran = true;
          }, i * this.animation_speed)
        }
        if (animation.type === 'compare') {
          const bar1Style = arraybars[animation.items[0].index].style;
          const bar2Style = arraybars[animation.items[1].index].style;
          setTimeout(() => {
            bar1Style.backgroundColor = comparingColor;
            bar2Style.backgroundColor = comparingColor;
            }, i * this.animation_speed
          )
        }
        else if (animation.type === 'setDefaultColor'){
          const bar1Style = arraybars[animation.items[0].index].style;
          const bar2Style = arraybars[animation.items[1].index].style;
          setTimeout(() => {
            bar1Style.backgroundColor = defaultColor;
            bar2Style.backgroundColor = defaultColor;
          }, i * this.animation_speed)
        }
        else if (animation.type === 'swap') {
          const bar1 = arraybars[animation.items[0].index];
          const bar2 = arraybars[animation.items[1].index];
          const bar1Style = bar1.style;
          const bar2Style = bar2.style;
          let height1 = animation.items[0].value;
          let height2 = animation.items[1].value;
          setTimeout(() => {
            bar1Style.height = `${Math.floor(height2/renderer)}vh`;
            bar2Style.height = `${Math.floor(height1/renderer)}vh`;
            if (this.status_bar_values_text){
              const bar1_text = bar1.getElementsByClassName("array-bar-text")[0];
              const bar2_text = bar2.getElementsByClassName("array-bar-text")[0];
              bar1_text.textContent = height2;
              bar2_text.textContent = height1;
            }
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
            bar1Style.height = `${height/renderer}vh`;
            if (this.status_bar_values_text){
              arraybars[item1.index].getElementsByClassName("array-bar-text")[0].textContent = height;
            }
            for(let k=startindex, l=0; k<lastindex; k++){
              let barStyle = arraybars[k+1].style;
              barStyle.height = `${Math.floor(arraybarsvalues[l]/renderer)}vh`;
              if (this.status_bar_values_text){
                let bar_text  = arraybars[k+1].getElementsByClassName("array-bar-text")[0];
                bar_text.textContent = arraybarsvalues[l];
              }
              l++; 
            }
          }, i * this.animation_speed)
        }
        else if(animation.type === "change_color"){
          const barStyle = arraybars[animation.items[0].index].style;
          setTimeout(() => {
            barStyle.backgroundColor = animation.newColor;
          }, i * this.animation_speed)
        }
        else if(animation.type === "change-colors"){
          let items = animation.items;
          let colors = animation.newColor;
          setTimeout(() => {
            for(let j=0; j<items.length; j++){
              let bar_style = arraybars[items[j].index].style;
              let color = colors[j];
              bar_style.backgroundColor = color;
            }
          }, i*this.animation_speed)
        }
      }
    }

    mergeSort(){
      this.animations = new Animations();
      //This functions returns all animations within the animations object
      mergeSortFuncRender(this.state.array, createValueBars(this.state.array), this.animations, this.state.array.length);
      this.renderAnimations(this.animations);
      this.disableInterface();
      setTimeout(() => {
        this.enableInterface()
      }, (this.animations.animations_array.length+1) * this.animation_speed);
    }

    selectionSort(){
      this.animations = new Animations();
      selectionSortRender(createValueBars(this.state.array), this.animations);
      console.log(this.animations);
      this.renderAnimations(this.animations);
      this.disableInterface();
      setTimeout(() => {
        this.enableInterface()
      }, (this.animations.animations_array.length+1) * this.animation_speed);
    }

    disableInterface(){
      this.running = true;
      let sorting_buttons = document.getElementsByClassName("sorting-buttons");
      for(let i=0; i<sorting_buttons.length; i++){
        sorting_buttons[i].setAttribute("disabled", "disabled");
      }
      let generate_array_button = document.getElementById("new-array-button");
      generate_array_button.setAttribute("disabled", "disabled");
      let slider = document.getElementById("adjusting-bar");
      slider.setAttribute("disabled", "disabled");
      this.ran = true;
    }

    enableInterface(){
      if (this.ran === false){
        let sorting_buttons = document.getElementsByClassName("sorting-buttons");
        for(let i=0; i<sorting_buttons.length; i++){
          sorting_buttons[i].removeAttribute("disabled");
        }
      }
      let generate_array_button = document.getElementById("new-array-button");
      generate_array_button.removeAttribute("disabled");
      let slider = document.getElementById("adjusting-bar");
      slider.removeAttribute("disabled");
    }

    handleChange(){
      let value = document.getElementById("adjusting-bar").value;
      //let bars_width = width_interpolation(value);
      this.amount_of_bars = value;
      this.resetArray();
      if (this.amount_of_bars > 12){
        this.status_bar_values_text = false;
      }
      this.animation_speed = speed_interpolation(value);
      this.changed = true;
      //Bug Fixer
      
    }

    render(){
      const {array} = this.state;
      return (<div className="application">
        <div className="array-container">
        {array.map((value, idx) => (
          <div className="array-bar" id={idx} key={idx} style={{height: `${Math.floor(value/renderer)}vh`}}>
            <div className="array-bar-text"></div>
          </div>
        ))}
        </div>
        <div id="interface">
            <div className="button-container">
              <button id="new-array-button" onClick={() => this.resetArray()}>New array</button>
            </div>
            <div className="separator"></div>
            <div className="adjusting-bar-container">
              <div className="text">Change size and speed of the Array</div>
              <input type="range" min="3" max="95" id="adjusting-bar" onChange={() => this.handleChange()}/>
            </div> 
            <div className="separator"></div>
            <div className="algorithms-button-container">
              <button className="sorting-buttons" onClick={() => this.mergeSort()}>Merge Sort <div className="time-complexity">O(n•Log n)</div></button>
              <button className="sorting-buttons" onClick={() => this.selectionSort()}>Selection Sort <div className="time-complexity">O(n<sup>2</sup>)</div></button>
            </div>
        </div>
        </div>
      )}
  }
  
  function Animation(type, items, optionalDriftArray, color) {
    this.type = type;
    this.items = items;
    this.drift_array = optionalDriftArray;
    this.newColor = color;
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
    this.colorItems = function(item1, item2) {
      this.animations_array.push(new Animation("set_last_merge_color", [new ValueBar(item1.value, item1.index), new ValueBar(item2.value, item2.index)]));
    }
    this.changeColor = function(item, color){
      this.animations_array.push(new Animation("change_color", [item], null, color))
    }
    this.changeColors = function(items, colors){
      this.animations_array.push(new Animation("change-colors", items, null, colors))
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
    let y1 = 400;
    let y2 = 5;
    let result = 3/x*300 //2.7 is the good one
    //let result = y1 + (((x-x1)/(x2-x1))*(y2-y1));
    return result;
  }