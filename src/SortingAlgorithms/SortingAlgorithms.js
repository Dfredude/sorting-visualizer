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
//Function used in main jsx App
export function mergeSortFuncRender(array, array_of_objects, animations) {
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
            //console.log(`Swapped ${obj1.value} with ${obj2.value}`);
            newArray.push(array[1], array[0]);
        }
        else {
            newArrayOfObjects.push(new ValueBar(obj1.value, obj1.index));
            newArrayOfObjects.push(new ValueBar(obj2.value, obj2.index))
            newArray.push(array[0], array[1]);
        }
    }
    else {
        //Merge!!!
        let [arr1, objArray1] = mergeSortFuncRender(array.slice(0, Math.floor(len/2)), array_of_objects.slice(0, Math.floor(len/2)), animations);
        let [arr2, objArray2] = mergeSortFuncRender(array.slice(Math.floor(len/2)), array_of_objects.slice(Math.floor(len/2)), animations);
        let i = 0;
        //console.log("Arr1");
        //for(i=0; i<objArray1.length; i++){
        //    console.log(objArray1[i])
        //}
        //console.log("Arr2");
        //for(i=0; i<objArray2.length; i++){
        //    console.log(objArray2[i])
        //}
        const startingIndex = objArray1[0].index;
        while (arr1.length != 0 && arr2.length != 0){
            //console.log(startingIndex);
            let objbar1 = objArray1[0];
            let objbar2 = objArray2[0];
            //console.log(`First merge! with values ${objbar1.value}, ${objbar2.value}`)
            animations.compareItems(objbar1, objbar2);
            //console.log("Comparing: ")
            //console.log(objbar1, objbar2)
            //console.log(arr1[0], arr2[0])
            if (arr1[0] < arr2[0]) {
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
                let objbar = objArray1[i];
                newArray.push(arr1[i]);
                //Aux Array
                newArrayOfObjects.push(new ValueBar(objbar.value, newArrayOfObjects[newArrayOfObjects.length-1].index+1));
            }
        }
        else {
            for (let i = 0; i<arr2.length; i++) {
                newArray.push(arr2[i]);
                let objbar = objArray2[i];
                newArrayOfObjects.push(new ValueBar(objbar.value, newArrayOfObjects[newArrayOfObjects.length-1].index+1));
            }
        }
    }
    return [newArray, newArrayOfObjects];
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