var data = {
  title: 'Title',
  class: 'Class',
  name: 'Name',
  test: {
    name: 'Name'
  },
  items: [
    {
      id: 1
    },
    {
      id: 2
    },
    {
      id: 3
    }
  ],
  users: [
    {
      name: 'User 1',
      age: 16
    },
    {
      name: 'User 2',
      age: 34
    },
    {
      name: 'User 3',
      age: 28
    }
  ]
};

var fragment = document.createDocumentFragment();

var text = document.getElementById('tpl').innerHTML;

var parser = new DOMParser();
var xml = parser.parseFromString(text, 'text/xml');
var template = xml.documentElement;

parseTemplate(template, data)

console.log(xml.documentElement.innerHTML)

function parseTemplate(node, data) {
  var nodes  = node.childNodes;
  for(var i in nodes) {
    var node = nodes[i];

    switch(node.tagName) {
      case 'for':
        parseFor(node, data);
        break;

      default :
        parseValue(node, data);
        break;
    }
  }
}

function parseFor(node, data) {
  var condition = node.getAttribute('condition');
  var html = [],o = {},
    itemName, itemsName;
  condition.replace(/\s*(\w+)\sin\s(\w+)\s*/g, function(math, item, items) {
    itemName = item;
    itemsName = items;
  });

  var childNodes = node.childNodes;

  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }

  if(data[itemsName]) {
    data[itemsName].forEach(function(item) {
      o[itemName] = item;
      html.push( parseTemplate(node, o) );
    });
  } else {
    html.push(math);
  }
}

function parseValue(node, data) {
  var value;
  if(typeof node.outerHTML === 'string') {
    node.outerHTML = node.outerHTML.replace(/\{([^{}]*)\}/g, function(math, p) {
       value = get(data, p);
       return value ? value : math;
     });
  }
}

function get(o, path) {
  path.split('.').forEach(function(name) {
    if(o) {
      o = o[name];
    }
  });

  return o;
};








































