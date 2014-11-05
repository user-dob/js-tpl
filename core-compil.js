function JsTpl(tpl) {
    var elements = [];
    var range = document.createRange();
    var xml, compiler;

    tpl = tpl.replace(/[ \t\n\r]*</g, '<');
    tpl = tpl.replace(/condition="([\s\S]*?)"/g, function(math, p) {
        return 'condition="' + htmlEntities(p) + '"';
    });

    xml = (new DOMParser()).parseFromString(tpl, 'application/xml');
    compiler = xml.documentElement;

    function htmlEntities(text) {
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    function parseTemplate(frag, node, data) {
        var nodes = node.childNodes;
        for(var i=0; i<nodes.length; i++) {
            parseNode(frag, nodes[i], data);
        };
    };

    function parseNode(frag, node, data) {
        switch(node.tagName) {
            case 'if':
                parseIf(frag, node, data);
                break;

            case 'for':
                parseFor(frag, node, data);
                break;

            default:
                parseEl(frag, node, data);
                break;
        };
    };

    function parseIf(frag, node, data) {
        var condition = node.getAttribute('condition');
        condition = condition.replace(/\{([^{}]*)\}/g, 'data.$1');
        condition = eval(condition);
        if(condition) {
            parseTemplate(frag, node, data);
        }
    };

    function parseFor(frag, node, data) {
        var condition = node.getAttribute('condition'),
            nodes = node.childNodes,
            itemName, itemsName, o = {};

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
        };
    };

    function parseEl(frag, node, data) {

        if(node.nodeType == 1) {
            var el = document.createElement(node.tagName);

            elements.push(el);

            var attributes = node.attributes;
            for(var j = 0; j<attributes.length; j++) {
                var attr = attributes[j];
                el.setAttribute(attr.name, parseText(attr.value, data));
                el.getAttributeNode(attr.name).tpl = attr.value;
            }

            if(node.childNodes.length) {
                parseTemplate(el, node, data);
            }
            frag.appendChild(el);
        }

        if(node.nodeType == 3) {
            var el = document.createTextNode(node.textContent);

            elements.push(el);

            el.textContent = parseText(node.textContent, data);
            el.tpl = node.textContent;

            frag.appendChild(el);

            //frag.appendChild(range.createContextualFragment(parseText(node.textContent, data)));
        }
    };




    function parseText(text, data) {
        var value;
        text = text || '';
        return text.replace(/\{([^{}]*)\}/g, function(math, p) {
            value = get(data, p);
            return value ? value : math;
        });
    };

    function get(o, path) {
        path.split('.').forEach(function(name) {
            if(o) {
                o = o[name];
            }
        });
        return o;
    };

    var frag = document.createDocumentFragment();
    parseTemplate(frag, compiler, {});

    function parseCompilEl(el, data) {
        if(el.nodeType == 1) {
            var attributes = el.attributes;
            for(var j = 0; j<attributes.length; j++) {
                var attr = attributes[j];
                el.setAttribute(attr.name, parseText(attr.tpl, data));
            }
        }

        if(el.nodeType == 3) {
            el.textContent = parseText(el.tpl, data);
        }
    }

    //console.log(elements);

    return function(data) {

        elements.forEach(function(el) {
            parseCompilEl(el, data);
        });

        return frag;
    }
}

var tpl = document.getElementById('tpl-tree').innerHTML;
var data = {
    name: 'Name',
    class: 'Class',
    users: [
        {name: 'Name 1', age: 14, posts: [{title: 'post 1'}, {title: 'post 2'}, {title: 'post 3'}]},
        {name: 'Name 2', age: 14, posts: [{title: 'post 1'}, {title: 'post 2'}, {title: 'post 3'}]},
        {name: 'Name 3', age: 15},
        {name: 'Name 4', age: 24},
        {name: 'Name 4', age: 24},
        {name: 'Name 4', age: 24, posts: [{title: 'post 1'}, {title: 'post 2'}, {title: 'post 3'}]},
        {name: 'Name 4', age: 24}
    ]
};

var jsTpl = new JsTpl(tpl);
console.time('js-tpl-compiler')
document.getElementById('div').appendChild(jsTpl(data));
console.timeEnd('js-tpl-compiler');

console.time('js-tpl-compiler')
data.name = 'Name 1';
jsTpl(data);
console.timeEnd('js-tpl-compiler');


console.time('js-tpl-compiler')
data.name = 'Name 2';
jsTpl(data);
console.timeEnd('js-tpl-compiler');
