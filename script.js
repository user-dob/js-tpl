window.onload = function() {
    'use strict'

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

    var text = document.getElementById('tpl').innerHTML;
    //document.getElementById('div').innerHTML = text.tpl(data);


    var reg = /(\{([^{}]+)\})|(?:<for([^>]*)\>)|(?:<\/for>)/g;

    console.log( reg.exec(text) );
    console.log( reg.exec(text) );
    console.log( reg.exec(text) );
    console.log( reg.exec(text) );
    console.log( reg.exec(text) );
    console.log( reg.exec(text) );
    console.log( reg.exec(text) );
    console.log( reg.exec(text) );


    <for items in item>
        <span>{item.name}</span>
    </for>

    var content = '<span>{item.name}</span>';

    items.forEach(function(item) {
        parse(content, item);
    })





}




