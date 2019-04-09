


// var testObject = { 'one': 1, 'two': 2, 'three': 3 };
// localStorage.setItem('testObject', JSON.stringify(testObject));
// var retrievedObject = JSON.parse(localStorage.getItem('testObject'));
// console.log('retrievedObject: ', retrievedObject);

class Element {
    constructor(id, tag, classes, props, children) {
        this.id = id;
        this.tag = tag;
        this.classes = classes;
        this.props = props;
        this.children = children;
    }

    greet() {
        return `${this.is} says hello.`;
    }
}


var dom = { 'body': null };
var selectedBrickDOM = null;

function clickLogo() {

    var elem0 = new Element('myid0', 'div', ['brick', 'level0'], [], [])

    var elem1 = new Element('myid12365', 'div', ['brick', 'level1'], [], [])

    var elem11 = new Element('myid213647', 'div', ['brick', 'level2'], [], [])
    var elem12 = new Element('myid225748', 'div', ['brick', 'level2'], [], [])
    var elem121 = new Element('myid31262', 'div', ['brick', 'level3'], [], [])

    var elem2 = new Element('myid125', 'div', ['brick', 'level1'], [], [])

    var elem21 = new Element('myid21457', 'div', ['brick', 'level2'], [], [])
    var elem211 = new Element('myid31215', 'div', ['brick', 'level3'], [], [])
    var elem212 = new Element('myid313567', 'div', ['brick', 'level3'], [], [])
    var elem22 = new Element('myid22659', 'div', ['brick', 'level2'], [], [])
    var elem221 = new Element('myid31354', 'div', ['brick', 'level3'], [], [])

    elem0.children.push(elem1);
    elem0.children.push(elem2);

    elem1.children.push(elem11);
    elem1.children.push(elem12);
    elem12.children.push(elem121);

    elem2.children.push(elem21);
    elem2.children.push(elem22);

    elem21.children.push(elem211);
    elem21.children.push(elem212);
    elem22.children.push(elem221);

    dom.body = elem0;

    updateAll();
}

function clickBrick(elem) {
    if (selectedBrickDOM != elem) {
        selectedBrickDOM = elem;
    }
    else {
        selectedBrickDOM = null
    }
    
    updateAll();
}

function updateAll() {
    updateReal();
    updateVirtual();
}

function updateReal() {
    // alert("updateReal");

    // empty the real DOM element
    document.getElementById("hierarchy").innerHTML = '';

    // recreate the hierarchy from state
    var hierarchy = document.getElementById("hierarchy");
    createHierarchy(dom.body, hierarchy, 0);
}

function createHierarchy(root, hierarchy, level) {
    var elem = document.createElement(root.tag);
    elem.setAttribute('id', root.id);
    elem.setAttribute('onclick', 'clickBrick(this)')
    var classes = 'brick';
    classes += ' level' + level;
    elem.innerHTML = root.id;
    if (selectedBrickDOM != null && root.id == selectedBrickDOM.id) {
        selectedBrickDOM = elem; // DEBUG -- Should not be necessary
        classes += ' selected'
        elem.innerHTML = '-';
    }
    elem.setAttribute('class', classes);

    hierarchy.appendChild(elem); // Add to the DOM

    if (selectedBrickDOM != null && root.id == selectedBrickDOM.id) {
        var keystone = createKeystone(root, level);
        hierarchy.appendChild(keystone); // Add to the DOM
    }

    var length = root.children.length;   
    for (var i = 0; i < length; i++) {
        createHierarchy(root.children[i], hierarchy, level + 1)
    }
    
}

function createKeystone(obj, level) {
    var keystone = document.createElement('div');
    keystone.setAttribute('id', obj.id);
    var classes = 'brick';
    classes += ' level' + level;
    classes += ' keystone';
    keystone.setAttribute('class', classes);

    addText(keystone, 'ID');
    addInput(keystone, obj.id, true);
    addText(keystone, 'Tag');
    addInput(keystone, obj.tag, true);
    addLineBreak(keystone);

    addLineBreak(keystone);
    addText(keystone, 'Classes');
    addLineBreak(keystone);
    for (var i = 0; i < obj.classes.length; i++) {
        addInput(keystone, obj.classes[i]);
        addLineBreak(keystone);
    }

    addLineBreak(keystone);
    addText(keystone, 'Properties');
    addLineBreak(keystone);
    for (var i = 0; i < obj.props.length; i++) {
        addInput(keystone, obj.props[i]);
        addLineBreak(keystone);
    }
    


    return keystone;
}

function addText(parent, text) {
    var elem = document.createTextNode(text);
    parent.appendChild(elem);
}

function addLineBreak(parent) {
    var elem = document.createElement('br');
    parent.appendChild(elem);
}

function addInput(parent, value, short = false) {
    var elem = document.createElement('input');
    if (short) {
        elem.setAttribute('class', 'short');
    }
    elem.setAttribute('value', value);
    parent.appendChild(elem);
}


function updateVirtual() {
    // alert("updateVirtual");
    // document.getElementById(id).innerHTML = elements
}



// Might be useful for creating the virtual screen
// function createHierarchy(elem) {
//     var root = document.createElement(elem.tag);
//     root.setAttribute('id', elem.id);
//     var classes = elem.classes.join(' ');
//     root.setAttribute('class', classes);

//     var length = root.children.length;   
//     for (var i = 0; i < length; i++) {
//         var child = createHierarchy(root.children[i])
//         root.appendChild(child);
//     }
//     return root;
// }