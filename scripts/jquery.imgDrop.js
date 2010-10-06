/**
 * Copyleft 2010 Stefan Natchev
 * All Rights Reversed
 * github.com/snatchev
 *
 * A simple plugin to handle dropping image files onto the browser.
 *  
 * Unfortunately, at the moment jQuery Draggable/Droppable
 * do not support dropping files from outside of the browser.
 *
 */

//css hack to make dragging work
jQuery(function() {
  jQuery('head').append('<style type="text/css">[draggable=true] {-webkit-user-drag: element; -webkit-user-select: none; -moz-user-select: none;}</style>');
});

(function( $ ){
  $.fn.imgDrop = function(options){
    return this.each(function(){
      
      var self = $(this);

      // settings
      var settings = new Object;
      settings.imageHandler = function(file){

        self.reader = new FileReader();
        var img = $('<img/>');
        self.reader.onload = function(event){
          img.attr('src', event.target.result);
        };
        self.reader.readAsDataURL(file);

        //wait until it's finished loading before passing it off to the callback.
        //I'm not crazy about this.
        while(self.reader.readyState == self.reader.LOADING){
          $.noop()
        };
        return img;
      },
      settings.afterDrop = function(element, dropTarget){
        $(element).appendTo(dropTarget);
      },
      settings.accepts = {'image': settings.imageHandler};

      if(typeof options == 'function') {
        settings.afterDrop = options;
      }
      if(typeof options == 'Object'){
        $.extend(settings, options);
      }

      // Tells the browser that we *can* drop on this target
      self.bind('dragover dragenter', function(event){
        if(event.preventDefault){
          event.preventDefault();
        }
        return false;
      });
      self.bind('drop', function(event){
        //do not allow the browser to handle the default drop behavior.
        if(event.preventDefault){
          event.preventDefault();
        }

        //jQuery normalizes the events to be cross-browser
        //get the dataTransfer from the original Event in modern browsers
        var dataTransfer = event.originalEvent.dataTransfer;
        //and bail if we can't continue
        if(!dataTransfer)
          return false;
        if(!dataTransfer.files)
          return false;

        for(var i=0; i < dataTransfer.files.length; i++){
          var file = dataTransfer.files[i];

          var handler = null;
          //find the handler based matching the accept string
          for(var type in settings.accepts){
            if(file.type.match(type)){
              handler = settings.accepts[type];
              break;
            }
          }
          
          //if no handler was found, go on to the next file.
          if(!handler) {
            continue;
          }
          var element = $(handler(file));

          //block until the reader is finished, sorry but i need to ensure I have that data string. I don't know what the callback will do.
          settings.afterDrop(element, self);
        }
        return false;
      });
    });
  };
})(jQuery);
