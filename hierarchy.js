


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
var selectedBrick = null;

function clickLogo() {

    var elem0 = new Element('page', 'div', ['brick', 'level0'], [], [])

    var elem1 = new Element('header', 'div', ['brick', 'level1'], [], [])

    var elem11 = new Element('logo', 'div', ['brick', 'level2'], [], [])
    var elem12 = new Element('login', 'div', ['brick', 'level2'], [], [])
    var elem121 = new Element('signUp', 'div', ['brick', 'level3'], [], [])

    var elem2 = new Element('content', 'div', ['brick', 'level1'], [], [])

    var elem21 = new Element('sortControls', 'div', ['brick', 'level2'], [], [])
    var elem211 = new Element('sortByDate', 'div', ['brick', 'level3'], [], [])
    var elem212 = new Element('sortByAuthor', 'div', ['brick', 'level3'], [], [])
    var elem22 = new Element('mainText', 'div', ['brick', 'level2'], [], [])
    var elem221 = new Element('insetImage', 'div', ['brick', 'level3'], [], [])

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
    var virtualId = toVirtualId(elem.id);
    if (selectedBrick == null || selectedBrick.id != virtualId) {
        selectedBrick = getElementWithId(virtualId);
    }
    else {
        selectedBrick = null;
    }
    
    updateAll();
}

function toRealId(virtual) {
    return 'real-' + virtual;
}
function toVirtualId(real) {
    return real.slice(5);
}

function getElementWithId(id) {
    return getElementWithIdRecursive(dom.body, id);
}
function getElementWithIdRecursive(root, id) {
    var elem = null;

    if (root.id == id) {
        elem = root;
    }
    
    for (var i = 0; i < root.children.length && elem == null; i++) {
        elem = getElementWithIdRecursive(root.children[i], id);
    }
    return elem;
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
    elem.setAttribute('id', toRealId(root.id));
    elem.setAttribute('onclick', 'clickBrick(this)')
    var classes = 'brick';
    classes += ' level' + level;
    elem.innerHTML = root.id;
    if (selectedBrick != null && root.id == selectedBrick.id) {
        classes += ' selected';
        elem.innerHTML = '-';
        elem.appendChild(createDuplicateButton());
        elem.appendChild(createAddButton());
    }
    elem.setAttribute('class', classes);

    hierarchy.appendChild(elem); // Add to the DOM

    if (selectedBrick != null && root.id == selectedBrick.id) {
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
    keystone.setAttribute('id', toRealId(obj.id) + '-keystone');
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

function createDuplicateButton() {
    var button = document.createElement('img');
    // <img class="icon" title="Duplicate this element" src="images/duplicate.png" alt="Dup">
    button.setAttribute('class', 'icon');
    button.setAttribute('src', 'images/duplicate.png');
    button.setAttribute('title', 'Duplicate this element');
    button.setAttribute('alt', 'Dup');
    button.setAttribute('onclick', 'clickDuplicate(this)');

    return button;
}

function createAddButton() {
    var button = document.createElement('img');
    button.setAttribute('class', 'icon');
    button.setAttribute('src', 'images/add.png');
    button.setAttribute('title', 'Add a child element');
    button.setAttribute('alt', 'Add');
    button.setAttribute('onclick', 'clickAdd(this)');

    return button;
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