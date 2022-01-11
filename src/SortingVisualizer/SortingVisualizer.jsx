import React from "react";
import { mergeSortFunc, mergeSortFuncRender, createValueBars, ValueBar } from "../SortingAlgorithms/SortingAlgorithms";
import './SortingVisualizer.css';

const defaultColor = 'blue';
const comparingColor = 'red';
const animation_speed = 10;

export default class SortingVisualizer extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        array: [],
      };
    }

    componentDidMount(){
      this.resetArray();
    }
  
    resetArray(){
      //const array = [110, 507, 329, 358, 306, 570];
      const array = [];
      for (let i = 0; i<270; i++) {
        let value = randomIntFromInterval(5,550);
        array.push(value);
      }
      this.setState({array});
    }
    
    testMergeSort(){
      for(let i=0; i<1000; i++){
        let not_animations = new Animations(); // used only for testing, useless for main program  
        this.resetArray();
        let [mySort, myObjSort] = mergeSortFuncRender(this.state.array, createValueBars(this.state.array), not_animations)
        let JSSort = this.state.array
          .slice()
          .sort((a,b) => a-b);
        let myObjSortInInts = convertObjectsArrayToIntsArray(myObjSort);
        if (areArraysEqual(JSSort, mySort) && areArraysEqual(JSSort, myObjSortInInts)){
          console.log("Works a treat!")
        }
      }
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
            }, i * animation_speed
          )
        }
        else if (animation.type === 'setDefaultColor'){
          const bar1Style = arraybars[animation.items[0].index].style;
          const bar2Style = arraybars[animation.items[1].index].style;
          setTimeout(() => {
            console.log("Iteration: "+i);
            bar1Style.backgroundColor = defaultColor;
            bar2Style.backgroundColor = defaultColor;
          }, i * animation_speed)
        }
        else if (animation.type === 'swap') {
          const bar1Style = arraybars[animation.items[0].index].style;
          const bar2Style = arraybars[animation.items[1].index].style;
          let height1 = animation.items[0].value;
          let height2 = animation.items[1].value;
          setTimeout(() => {
            console.log("Iteration: "+i);
            bar1Style.height = `${height2}px`;
            bar2Style.height = `${height1}px`;
          }, i * animation_speed)
        }
        else if (animation.type === "override") {
          let item1 = animation.items[0];
          let item2 = animation.items[1];
          let drift_array = animation.drift_array;
          let lastindex = item2.index;
          let startindex = item1.index;
          let bar1Style = arraybars[item1.index].style;
          let height = item2.value;
          //Array containing all heights of bars going to drift right
          let arraybarsvalues = [];
          for(let j=0; j<drift_array.length; j++){
            arraybarsvalues.push(drift_array[j].value);
          }
          setTimeout(() => {
            console.log("Iteration: "+i);
            console.log(startindex, lastindex)
            for(let k=startindex, l=0; k<lastindex; k++){
              bar1Style.height = `${height}px`;
              //console.log(arraybars[k+1].style.height);
              let barStyle = arraybars[k+1].style;
              barStyle.height = `${arraybarsvalues[l]}px`;
              l++; 
            }
          }, i * animation_speed)
        }
      }
    }

    mergeSort(){
      this.animations = new Animations();
      let [sortedArray, sortedObjectsArray] = mergeSortFuncRender(this.state.array, createValueBars(this.state.array), this.animations);
      let sortedObjectsArrayInInts = convertObjectsArrayToIntsArray(sortedObjectsArray);
      console.log(this.animations.animations_array);
      this.renderAnimations(this.animations);
    }

    test(){
      console.log(this.state.array)
    }

    render(){
      const {array} = this.state;
      return (<>
        <div class="array-container">
        {array.map((value, idx) => (
          <div className="array-bar" key={idx} style={{height: `${value}px`}}>
          </div>
        ))}
        </div>
        <br></br><br /><br />
        <div class="buttons">
          <button onClick={() => this.resetArray()}>Generate new Array</button>
          <button onClick={() => this.mergeSort()}>Merge Sort</button>
          <button onClick={() => this.test()}>Test</button>
        </div>
        </>
      )}
  }
  
  function Animation(type, items, optionalDriftArray) {
    this.type = type;
    this.items = items;
    this.drift_array = optionalDriftArray;
  }
  function Animations() {
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
