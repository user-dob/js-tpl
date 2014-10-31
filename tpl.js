String.prototype.tpl = function(data) {

    var s;

    function get(o, path) {
        path.split('.').forEach(function(name) {
            if(o) {
                o = o[name];
            }
        });

        return o;
    };


    function parseValue(text, data) {
        var value;
        return text.replace(/\{([^{}]*)\}/g, function(math, p) {
            value = get(data, p);
            return value ? value : math;
        });
    };

    function parseFor(text, data, parse) {
        return text.replace(/<for([^>]*)>([\s\S]*?)<\/for>/g, function(math, f, context) {

            var html = [],o = {},
                itemName, itemsName;

            f.replace(/\s*(\w+)\sin\s(\w+)\s*/g, function(math, item, items) {
                itemName = item;
                itemsName = items;
            });

            if(data[itemsName]) {
                data[itemsName].forEach(function(item) {
                    o[itemName] = item;
                    html.push( parse(context, o) );
                });
            } else {
                html.push(math);
            }

            return html.join('');
        });
    };

    s = this.toString();
    s = parseValue(s, data);
    s = parseFor(s, data, parseValue);

    return s;
};



