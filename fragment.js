var data = {
  title: 'Title',
  name: 'Name',
  class: 'Class'
}


var text = document.getElementById('tpl').innerHTML;
var frag = document.createDocumentFragment();

var parser = new DOMParser();
var xml = parser.parseFromString(text, 'application/xml');
var node = xml.documentElement;
parseTemplate(frag, node, data)

//console.log(node.childNodes)

function parseTemplate(frag, node, data) {
  var nodes = node.childNodes;
  for(var i=0; i<nodes.length; i++) {
    var node = nodes[i];

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
  };
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





