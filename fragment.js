var data = {
  title: 'Title',
  name: 'Name',
  class: 'Class',
  user: {
    name: 'Rem'
  },
  users: [
    {name: 'Name 1', age: 14, posts: [{title: 'post 1'}, {title: 'post 2'}, {title: 'post 3'}]},
    {name: 'Name 2', age: 14, posts: [{title: 'post 1'}, {title: 'post 2'}, {title: 'post 3'}]},
    {name: 'Name 3', age: 15},
    {name: 'Name 4', age: 24},
    {name: 'Name 4', age: 24},
    {name: 'Name 4', age: 24},
    {name: 'Name 4', age: 24}
  ]
}

console.time('tpl')
var text = document.getElementById('tpl-for').innerHTML;
text = text.replace(/condition="([\s\S]*?)"/g, function(math, p) {
    return 'condition="' + escape(p) + '"';
});

//console.log(text)

var frag = document.createDocumentFragment();

var xml = (new DOMParser()).parseFromString(text, 'application/xml');

//console.log(xml)

var node = xml.documentElement;
parseTemplate(frag, node, data)

function parseTemplate(frag, node, data) {
    var nodes = node.childNodes;
    for(var i=0; i<nodes.length; i++) {
        parseNode(frag, nodes[i], data);
    };
}

function parseNode(frag, node, data) {
    switch(node.tagName) {
        case 'if':
            parseIf(frag, node, data);
            break;

        case 'for':
            parseFor(frag, node, data);
            break;

        default:
            parseEl(frag, node, data)
            break;
    }
}

function parseIf(frag, node, data) {
    var condition = node.getAttribute('condition');
    condition = unescape(condition);
    condition = condition.replace(/\{([^{}]*)\}/g, 'data.$1');

    //console.log(condition)

    condition = eval(condition);

    //console.log(condition)

    if(condition) {
        parseTemplate(frag, node, data);
    }
}

function parseFor(frag, node, data) {
  var condition = node.getAttribute('condition'),
    nodes = node.childNodes,
    itemName, itemsName, o = {};

  condition = unescape(condition);

  condition.replace(/\s*(\w+)\sin\s([\w\.]+)\s*/g, function(math, item, items) {
    itemName = item;
    itemsName = items;
  });

    data = get(data, itemsName);

    if(data) {
        data.forEach(function(item) {
        o[itemName] = item;
        parseTemplate(frag, node, o);
    });
  }
}

function parseEl(frag, node, data) {

  if(node.nodeType == 1) {
    var el = document.createElement(node.tagName);

    var attributes = node.attributes;
    for(var j = 0; j<attributes.length; j++) {
      var attr = attributes[j];
      el.setAttribute(attr.name, parseText(attr.value, data));
    }

    if(node.childNodes.length) {
      parseTemplate(el, node, data);
    }
    frag.appendChild(el);
  }

  if(node.nodeType == 3) {
    var el = document.createTextNode(parseText(node.textContent, data));
    frag.appendChild(el);
  }
}


function parseText(text, data) {
  var value;
  return text.replace(/\{([^{}]*)\}/g, function(math, p) {
    value = get(data, p);
    return value ? value : math;
  });
}


function get(o, path) {
  path.split('.').forEach(function(name) {
    if(o) {
      o = o[name];
    }
  });
  return o;
};


document.getElementById('div').appendChild(frag);

console.timeEnd('tpl')



