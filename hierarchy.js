


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
    var elem1 = new Element('myid1', 'div', ['brick', 'level1'], [], [])

    var elem21 = new Element('myid21', 'div', ['brick', 'level2'], [], [], true)
    var elem22 = new Element('myid22', 'div', ['brick', 'level2'], [], [])
    var elem31 = new Element('myid31', 'div', ['brick', 'level3'], [], [])

    elem1.children.push(elem21);
    elem1.children.push(elem22);
    elem22.children.push(elem31);

    dom.body = elem1;

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
    createHierarchy(dom.body, hierarchy, 1);
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
    var elem = document.createElement('div');
    elem.setAttribute('id', obj.id);
    var classes = 'brick';
    classes += ' level' + level;
    classes += ' keystone'
    elem.setAttribute('class', classes);
    elem.innerHTML = `
        ID<input id="id" value="brick3"/>
        Tag<input id="tag" value="div"/><br /><br />
        Classes<br />
        <input id="class1" value="class1"/> X<br />
        Properties<br />
        <input id="prop1" value="background-color: #ffffff"/> X &nbsp;!<br />
        <input id="prop1" value="background-color: #ffffff"/> X <br />
        <input id="prop1" value="background-color: #ffffff"/> X <br />
    `;

    hierarchy.appendChild(elem); // Add to the DOM

    return elem;
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