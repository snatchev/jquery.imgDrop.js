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
        //this was taken from mozilla docs.
        //it looks like crap, but i haven't managed to untangle it. not worth it right now
        //from: https://developer.mozilla.org/en/Using_files_from_web_applications
        var img = document.createElement("img");
        img.file = file;

        var reader = new FileReader();
        reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
        reader.readAsDataURL(file);
        return $(img);
      },
      settings.afterDrop = function(element, dropTarget){
        (element).appendTo(dropTarget);
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

          settings.afterDrop($(handler(file)), self);
        }
        return false;
      });
    });
  };
})(jQuery);
