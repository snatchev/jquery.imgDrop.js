jquery.imgDrop.js
=================

A jQuery plugin to handle html5 drag and drop support of files from the desktop.

jQuery has awesome UI plugins for draggable and droppables but at the moment,
they do nothing to handle elements from outside the browser. Maybe when it becomes standardized, we will see it.
Nevertheless, I need it NOW!

doesn't work in IE.

Examples
--------

Default will append the image you drop onto the drop target

    $(document).ready(function(){
        $("#drop-target").imgDrop();
    });

Default Options

    $(document).ready(function(){
        $("#drop-target").imgDrop(function(img, dropTarget){
            $(img).appendTo(dropTarget);
        });
    });

Setting certain callbacks

    $("#loading-callbacks").imgDrop({
      drop: function(img, dropTarget){
        $(img).css('float', 'left').appendTo(dropTarget);
      },
      load: function(dropTarget){
        $(dropTarget).append('loading...<br/>');
      },
      loadEnd: function(state, dropTarget){
        $(dropTarget).append('loaded, ' + state);
      }
    });


[DEMO](http://www.snatchev.com/jquery.imgDrop.js/)
