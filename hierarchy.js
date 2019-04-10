


// var testObject = { 'one': 1, 'two': 2, 'three': 3 };
// localStorage.setItem('testObject', JSON.stringify(testObject));
// var retrievedObject = JSON.parse(localStorage.getItem('testObject'));
// console.log('retrievedObject: ', retrievedObject);

class Element {
    constructor(id, tag, level, parent, classes, styles, attributes, children) {
        this.id = id;
        this.tag = tag;
        this.level = level;
        this.parent = parent;
        this.classes = classes;
        this.styles = styles;
        this.attributes = attributes;
        this.children = children;
    }

    greet() {
        return `${this.is} says hello.`;
    }
}


var dom = { 'body': null };
var selectedBrick = null;

window.onload = function clickLogo() {

    var elem0 = new Element('page', 'div', 0, null, ['brick', 'level0'], [], [], [])

    var elem1 = new Element('header', 'div', 1, elem0, ['brick', 'level1'], [], [], [])

    var elem11 = new Element('logo', 'div', 2, elem1, ['brick', 'level2'], [], [], [])
    var elem12 = new Element('login', 'div', 2, elem1, ['brick', 'level2'], [], [], [])
    var elem121 = new Element('signUp', 'div', 3, elem12, ['brick', 'level3'], ['width: 100px'], ['href="#top"'], [])

    var elem2 = new Element('content', 'div', 1, elem0, ['brick', 'level1'], [], [], [])

    var elem21 = new Element('sortControls', 'div', 2, elem2, ['brick', 'level2'], [], [], [])
    var elem211 = new Element('sortByDate', 'div', 3, elem21, ['brick', 'level3'], [], [], [])
    var elem212 = new Element('sortByAuthor', 'div', 3, elem21, ['brick', 'level3'], [], [], [])
    var elem22 = new Element('mainText', 'div', 2, elem2, ['brick', 'level2'], [], [], [])
    var elem221 = new Element('insetImage', 'div', 3, elem22, ['brick', 'level3'], [], [], [])

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

function clickAddChild(event, elem) {
    stopProp(event);
    
    var virtualId = toVirtualId(elem.id);
    var parent = getElementWithId(virtualId);
    var tempId = parent.id + '-child' + parent.children.length;
    var child = new Element(tempId, 'div', parent.level + 1, parent, ['brick', 'level' + (parent.level + 1)], [], [], []);
    parent.children.push(child);
    selectedBrick = child;
    updateAll();
}

function clickAddProp(event, button, keystone) {
    var elem = getElementWithId(toVirtualId(fromKeystoneId(keystone.id)));

    if (button.classList.contains('addClass')) {
        elem.classes.push('');
    }
    else if (button.classList.contains('addStyle')) {
        elem.styles.push('');
    }
    else if (button.classList.contains('addAttribute')) {
        elem.attributes.push('');
    }

    updateReal();
}

function clickDuplicate(event, elem) {
    stopProp(event);

    var virtualId = toVirtualId(elem.id);
    var sibling = getElementWithId(virtualId);
    var parent = sibling.parent;
    var tempId = sibling.id + '-sibling' + parent.children.length;
    var child = new Element(tempId, 'div', parent.level + 1, parent, ['brick', 'level' + (parent.level + 1)], [], [], []);
    parent.children.push(child);
    selectedBrick = child;
    updateAll();
}

function stopProp(event) {
    if (event.stopPropagation){
        event.stopPropagation();
    }
    else if(window.event){
       window.event.cancelBubble=true;
    }
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
    classes += ' noselect';
    elem.innerHTML = root.id;
    if (selectedBrick != null && root.id == selectedBrick.id) {
        classes += ' selected';
        elem.innerHTML = '';
        if (root.parent != null) { // Don't have these buttons if at level 0.
            elem.appendChild(createDuplicateButton(root));
        }
        elem.appendChild(createAddChildButton(root));
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
    addInput(keystone, obj.id, 'inputId');
    addLineBreak(keystone);
    addText(keystone, 'Tag');
    addInput(keystone, obj.tag, 'inputTag');

    addLineBreak(keystone);
    addText(keystone, 'Classes');
    keystone.appendChild(createAddPropButton('addClass'));
    addLineBreak(keystone);
    for (var i = 0; i < obj.classes.length; i++) {
        addInput(keystone, obj.classes[i], 'inputClass', i);
        keystone.appendChild(createDeletePropButton('deleteClass'));
        addLineBreak(keystone);
    }

    addText(keystone, 'Styles');
    keystone.appendChild(createAddPropButton('addStyle'));
    addLineBreak(keystone);
    for (var i = 0; i < obj.styles.length; i++) {
        addInput(keystone, obj.styles[i], 'inputStyle', i);
        keystone.appendChild(createDeletePropButton('deleteStyle'));
        addLineBreak(keystone);
    }

    addText(keystone, 'Attributes');
    keystone.appendChild(createAddPropButton('addAttribute'));
    addLineBreak(keystone);
    for (var i = 0; i < obj.attributes.length; i++) {
        addInput(keystone, obj.attributes[i], 'inputAttribute', i);
        keystone.appendChild(createDeletePropButton('deleteAttribute'));
        addLineBreak(keystone);
    }

    return keystone;
}

function addText(parent, text) {
    // var elem = document.createTextNode(text);

    var elem = document.createElement('label');
    elem.setAttribute('class', 'shortLabel');
    elem.innerHTML = text;
    parent.appendChild(elem);
}

function addLineBreak(parent) {
    var elem = document.createElement('br');
    parent.appendChild(elem);
}

function addInput(parent, value, purpose, index = -1) {
    var elem = document.createElement('input');
    
    if (index != -1) {
        purpose = purpose + ' index-' + index;
    }
    elem.setAttribute('class', purpose);
    elem.setAttribute('value', value);
    elem.setAttribute('onchange', 'changeInput(this, this.parentElement)');
    parent.appendChild(elem);
}

function fromKeystoneId(id) {
    return id.slice(0, -9);
}

function changeInput(input, keystone) {
    var brick = getElementWithId(toVirtualId(fromKeystoneId(keystone.id)));
    

    if (input.classList.contains('inputId')) {
        brick.id = input.value;
    }
    else if (input.classList.contains('inputClass')) {
        var index = findIndex(input.classList, 'index-');
        brick.classes[index] = input.value;
    }
    else if (input.classList.contains('inputStyle')) {
        var index = findIndex(input.classList, 'index-');
        brick.styles[index] = input.value;
    }
    else if (input.classList.contains('inputAttribute')) {
        var index = findIndex(input.classList, 'index-');
        brick.attributes[index] = input.value;
    }

    updateReal();
}

function findIndex(classList, query) {
    result = 0;
    for (i = 0; i < classList.length; i++) {
        var c = classList[i];
        if (c.substring(0, 6) === query) {
            result = parseInt(c.slice(6));
            break;
        }
    }
    return result;
}

function createDuplicateButton(obj) {
    var button = document.createElement('img');
    // <img class="icon" title="Duplicate this element" src="images/duplicate.png" alt="Dup">
    button.setAttribute('class', 'icon');
    button.setAttribute('src', 'images/duplicate.png');
    button.setAttribute('title', 'Duplicate this element');
    button.setAttribute('alt', 'Dup');
    button.setAttribute('onclick', 'clickDuplicate(event, this.parentElement)');

    return button;
}

function createAddChildButton(obj) {
    var button = document.createElement('img');
    button.setAttribute('class', 'icon');
    button.setAttribute('src', 'images/add.png');
    button.setAttribute('title', 'Add a child element');
    button.setAttribute('alt', 'Add');
    button.setAttribute('onclick', 'clickAddChild(event, this.parentElement)');

    return button;
}

function createAddPropButton(purpose) {
    var button = document.createElement('img');
    button.setAttribute('class', 'icon ' + purpose);
    button.setAttribute('src', 'images/add.png');
    button.setAttribute('title', 'Add a new property');
    button.setAttribute('alt', 'Add');
    button.setAttribute('onclick', 'clickAddProp(event, this, this.parentElement)');

    return button;
}

function createDeletePropButton(purpose) {
    var button = document.createElement('img');
    button.setAttribute('class', 'iconleft ' + purpose);
    button.setAttribute('src', 'images/delete.png');
    button.setAttribute('title', 'Add a new property');
    button.setAttribute('alt', 'Add');
    button.setAttribute('onclick', 'clickDeleteProp(event, this, this.parentElement)');

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