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

        var img = $('<img/>');

        //set up the events
        self.reader.onload = function(event){
          img.attr('src', event.target.result);
        };

        self.reader.readAsDataURL(file);
        if(settings.blocking == true){
          while(self.reader.readyState == self.reader.LOADING){
            true;
          }
        }
        return img;
      }
      settings.load = function(dropTarget){
        //nothing
      }
      settings.loadError = function(errorMessage, dropTarget){
        //nothing
      }
      settings.loadEnd = function(state, dropTarget){
        //nothing
      }
      settings.drop = function(element, dropTarget){
        $(element).appendTo(dropTarget);
      }

      settings.blocking = false;

      settings.accepts = {'image': settings.imageHandler};


      if(typeof options == 'function') {
        settings.drop = options;
      }
      if(typeof options == 'object'){
        $.extend(settings, options);
      }

      self.reader = new FileReader();
      self.reader.onloadstart = function(){settings.load(self);}
      self.reader.onloadend =   function(){settings.loadEnd(self.reader.readyState, self);}

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

          settings.drop(element, self);
        }
        return false;
      });
    });
  };
})(jQuery);
