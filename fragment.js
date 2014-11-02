var data = {
  title: 'Title',
  name: 'Name',
  class: 'Class',
  user: {
    name: 'Rem'
  },
  users: [
    {name: 'Name 1', age: 14},
    {name: 'Name 2', age: 14},
    {name: 'Name 3', age: 15},
    {name: 'Name 4', age: 24},
    {name: 'Name 4', age: 24},
    {name: 'Name 4', age: 24},
    {name: 'Name 4', age: 24}
  ]
}

console.time('tpl')
var text = document.getElementById('tpl-for').innerHTML;
var frag = document.createDocumentFragment();

var parser = new DOMParser();
var xml = parser.parseFromString(text, 'application/xml');
var node = xml.documentElement;
parseTemplate(frag, node, data)

function parseTemplate(frag, node, data) {
  var nodes = node.childNodes;
  for(var i=0; i<nodes.length; i++) {
    var node = nodes[i];
    switch(node.tagName) {
      case 'for':
        parseFor(frag, node, data);
        break;

      default:
        parseEl(frag, node, data)
        break;
    }
  };
}

function parseFor(frag, node, data) {
  var condition = node.getAttribute('condition'),
    nodes = node.childNodes,
    itemName, itemsName, o = {};

  condition.replace(/\s*(\w+)\sin\s(\w+)\s*/g, function(math, item, items) {
    itemName = item;
    itemsName = items;
  });

  if(data[itemsName]) {
    data[itemsName].forEach(function(item) {
      o[itemName] = item;
      for(var i=0; i<nodes.length; i++) {
        parseEl(frag, nodes[i], o);
      }
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



