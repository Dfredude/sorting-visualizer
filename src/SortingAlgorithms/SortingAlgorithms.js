import { calculateNewValue } from "@testing-library/user-event/dist/utils";

//Function used in main jsx App
export function mergeSortFuncRender(array, array_of_objects, animations, total_length) {
    let newArray = [];
    let newArrayOfObjects = [];
    let len = array.length;
    if (len === 1) {
        let obj = array_of_objects[0];
        newArray.push(array[0]);
        newArrayOfObjects.push(new ValueBar(obj.value, obj.index));
    }
    else if (len === 2) {
        //Creating comparing animation
        let obj1 = array_of_objects[0];
        let obj2 = array_of_objects[1];
        animations.compareItems(obj1, obj2);
        if (array[0] > array[1]) {
            animations.swapItems(obj1, obj2)
            //Update indexes in return list
            newArrayOfObjects.push(new ValueBar(obj2.value, obj1.index), new ValueBar(obj1.value, obj2.index));
            newArray.push(array[1], array[0]);
        }
        else {
            newArrayOfObjects.push(new ValueBar(obj1.value, obj1.index));
            newArrayOfObjects.push(new ValueBar(obj2.value, obj2.index))
            newArray.push(array[0], array[1]);
        }
    }
    else {
        let [arr1, objArray1] = mergeSortFuncRender(array.slice(0, Math.floor(len/2)), array_of_objects.slice(0, Math.floor(len/2)), animations, total_length);
        let [arr2, objArray2] = mergeSortFuncRender(array.slice(Math.floor(len/2)), array_of_objects.slice(Math.floor(len/2)), animations, total_length);
        let i = 0;
        let last_merge = false;
        if (arr1.length+arr2.length === total_length){
            last_merge = true;
        }
        const startingIndex = objArray1[0].index;
        while (arr1.length != 0 && arr2.length != 0){
            let objbar1 = objArray1[0];
            let objbar2 = objArray2[0];
            animations.compareItems(objbar1, objbar2);
            if (arr1[0] < arr2[0]) {
                if (last_merge === true){
                    animations.changeColor(objbar1, "green"); 
                }
                newArray.push(arr1[0]);
                arr1.shift();
                //Aux Array
                newArrayOfObjects.push(new ValueBar(objbar1.value, objbar1.index));
                objArray1.shift();
                
            }
            else {
                newArray.push(arr2[0]);
                arr2.shift()
                //Animation push
                animations.overrideItems(objbar1, objbar2, objArray1.slice());
                //Aux Array
                newArrayOfObjects.push(new ValueBar(objbar2.value, objArray1.index));
                if (last_merge === true){
                    animations.changeColor(newArrayOfObjects[newArrayOfObjects.length-1], "green")    
                }
                //Update existing objarray indexes
                objArray1.forEach(element => {
                    element.index++;
                });

                
                objArray2.shift();
            }
            i++;
        }
        setIndexesToNewObjectsArray(newArrayOfObjects, startingIndex);
        if (arr2.length <= 0) {
            for (let i = 0; i<arr1.length; i++) {
                if (last_merge === true){
                    animations.changeColor(objArray1[i], "green");
                }
                let objbar = objArray1[i];
                newArray.push(arr1[i]);
                //Aux Array
                newArrayOfObjects.push(new ValueBar(objbar.value, newArrayOfObjects[newArrayOfObjects.length-1].index+1));
            }
        }
        else {
            for (let i = 0; i<arr2.length; i++) {
                if (last_merge === true){
                    animations.changeColor(objArray2[i], "green");
                }
                newArray.push(arr2[i]);
                let objbar = objArray2[i];
                newArrayOfObjects.push(new ValueBar(objbar.value, newArrayOfObjects[newArrayOfObjects.length-1].index+1));
            }
        }
    }
    return [newArray, newArrayOfObjects];
}

export function selectionSortRender(values_array, animations){
    let new_array = [];
    let values_array_copy = values_array.slice();
    let new_index = 0;
    let sorted = 0;
    while (values_array_copy.length > 0){
        let min = values_array_copy[0];
        //Initiating smallest value
        animations.changeColor(new ValueBar(min.value, sorted), "purple");
        for(let i=1; i<values_array_copy.length;i++){
            let item = values_array_copy[i];
            animations.changeColor(new ValueBar(item.value, sorted+i), "red");
            if(item.value < min.value){
                animations.changeColors([new ValueBar(min.value, sorted+min.index), new ValueBar(item.value, sorted+i)], ['yellow', 'yellow']);
                animations.changeColors([new ValueBar(min.value, sorted+min.index), new ValueBar(item.value, sorted+i)], ['yellow', 'yellow']);
                animations.changeColors([new ValueBar(min.value, sorted+min.index), new ValueBar(item.value, sorted+i)], ['blue', 'blue']);
                animations.changeColor(new ValueBar(item.value, sorted+i), "purple")
                
                min = item;
                
            }
            else{
                animations.changeColor(new ValueBar(item.value, sorted+i), "blue")
            }
        }
        //animations.changeColors([new ValueBar(min.value, sorted+min.index), new ValueBar(item.value, sorted+i)], ['blue', 'yellow']);
        animations.overrideItems(new ValueBar(values_array_copy[0], sorted), new ValueBar(min.value, sorted+min.index), values_array_copy)
        animations.changeColor(new ValueBar(min.value, sorted), "green")
        if (min.index+sorted != sorted){
            animations.changeColor(new ValueBar(min.value, sorted+min.index), "blue")
        }
        //Returnin smalles value of each iteration
        new_array.push(new ValueBar(min.value, new_index))
        values_array_copy.splice(min.index, 1);
        //sorted++;
        setIndexesToNewObjectsArray(values_array_copy, 0)
        sorted++;
        new_index++;
    }  
    return new_array;   
}

export function ValueBar(value, index){
    this.value = value;
    this.index = index;
}

export function createValueBars(array){
    let newArrayOfObjects = []
    for(let i=0; i<array.length; i++){
        newArrayOfObjects.push(new ValueBar(array[i], i));
    }
    return newArrayOfObjects;
}

function setIndexesToNewObjectsArray(array_of_objects, initial_index){
    let len = array_of_objects.length;
    for(let i=0; i<len; i++){
        array_of_objects[i].index = initial_index+i;
    }
}

function updateIndexes(array_of_objects, initial_index){
    let newArray = [];
    let len = array_of_objects.length;
    let i = 0
    for(let item of array_of_objects){
        newArray.push(new ValueBar(item.value, initial_index+i));
        i++;
    }
}

export function mergeSortArrObjects(bar_objects) {
    let newArray = []
    let len = bar_objects.length
    if (len === 1) {
        newArray.push(bar_objects[0]);
    }
    else if (len === 2) {
        if (bar_objects[0] > bar_objects[1]) {
            newArray.push(bar_objects[1], bar_objects[0]);
        }
        else {
            newArray.push(bar_objects[0], bar_objects[1]);
        }
    }
    else {
        let arr1 = mergeSortFunc(bar_objects.slice(0, Math.floor(len/2)));
        let arr2 = mergeSortFunc(bar_objects.slice(Math.floor(len/2)));
        while (arr1.length != 0 && arr2.length != 0){
            if (arr1[0] < arr2[0]) {
                newArray.push(arr1[0]);
                arr1.shift();
            }
            else {
                newArray.push(arr2[0]);
                arr2.shift()
            }
        }

        if (arr2.length < 1) {
            for (let i = 0; i<arr1.length; i) {
                newArray.push(arr1[0]);
                arr1.shift();
            }
        }
        else {
            for (let i = 0; i<arr2.length; i) {
                newArray.push(arr2[0]);
                arr2.shift();
            }
        }
    }
    return newArray
}


//Unused function*
export function mergeSortFunc(array) {
    let newArray = []
    let len = array.length
    if (len === 1) {
        newArray.push(array[0]);
    }
    else if (len === 2) {
        if (array[0] > array[1]) {
            newArray.push(array[1], array[0]);
        }
        else {
            newArray.push(array[0], array[1]);
        }
    }
    else {
        let arr1 = mergeSortFunc(array.slice(0, Math.floor(len/2)));
        let arr2 = mergeSortFunc(array.slice(Math.floor(len/2)));
        while (arr1.length != 0 && arr2.length != 0){
            if (arr1[0] < arr2[0]) {
                newArray.push(arr1[0]);
                arr1.shift();
            }
            else {
                newArray.push(arr2[0]);
                arr2.shift()
            }
        }

        if (arr2.length < 1) {
            for (let i = 0; i<arr1.length; i) {
                newArray.push(arr1[0]);
                arr1.shift();
            }
        }
        else {
            for (let i = 0; i<arr2.length; i) {
                newArray.push(arr2[0]);
                arr2.shift();
            }
        }
    }
    return newArray
}