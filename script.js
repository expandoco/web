//requirejs(['config']);

requirejs.config({
  nodeRequire: require,
  baseUrl: 'scissr',
    // paths: {
    //     'scissr': 'scissr'
    // }
  });


require(['scissr'], function(scissr){

var ios = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent);
  var mac = ios || /Mac/.test(navigator.platform);
  var movie = CodeMirror.movie('code',
    {
      lineNumbers: false,
      styleActiveLine: true,
      matchBrackets: true
    });

  $(".close").click(function(c){
    $("#errorBar").hide();
  })

  var editor = movie._editor;

  init();

  function addSplash(){
    var cl = 'CodeMirror-movie__splash_playing';

    var buttonLabels = {
      'play': (mac ? '▶ ' : '') + 'Play demo',
      'pause': (mac ? '\u275a\u275a ' : '') + 'Pause',
      'play_again': (mac ? '▶ ' : '') + 'Play again',
      'try_yourself': 'Try it yourself'
    };

var removeSplash = function() {
      if (splash) {
        splash.remove();
        splash = null;
      }
    };

    var splash = $('<div class="CodeMirror-movie__splash">' + 
      '<div class="CodeMirror-movie__splash-text"><span class="CodeMirror-movie__splash-play-btn">▶</span> Watch demo</div>'  + 
      '</div>').click(function() {
        movie.play();
      });

    movie.on('play', removeSplash);
    
    // movie
    //   .on('stop pause', function() {
    //     splash.removeClass(cl);
    //   })
    //   .on('play resume', function() {
    //     splash.addClass(cl);
    //   });

      var $w = $(editor.getWrapperElement());
    
    $w.append(splash);
    
    movie.on('play', removeSplash);

    // create toolbar
    var btnPlay = $('<button class="btn btn-mini btn-primary CodeMirror-movie__btn-play">' + buttonLabels.play +'</button>')
      .click(function() {
        movie.toggle();
      });

    var btnTry = $('<button class="btn btn-mini btn-success CodeMirror-movie__btn-try">' + buttonLabels.try_yourself +'</button>')
      .click(function() {
        movie.stop();
        removeSplash();
        editor.execCommand('revert');
        editor.focus();
      });
    
    var toolbar = $('<div class="CodeMirror-movie__toolbar"></div>')
      .append(btnPlay)
      .append(btnTry);
    
    movie
      .on('play resume', function() {
        btnPlay.html(buttonLabels.pause);
      })
      .on('pause stop', function() {
        btnPlay.html(buttonLabels.play_again);
      });
    
    $(".toolbar").append(toolbar);
  }

  function init(){
  
    addSplash();


    CodeMirror.commands.scissrExpand = function(cm){
      go();
    };

    // CodeMirror.keyMap.scissrExpandMap = {
    //   "Shift-Tab": "scissrExpand",
    //   fallthrough: ['basic']
    // };

    editor.setOption("extraKeys", {
  "Shift-Tab": "scissrExpand"
});

  

    // movie.play();

    editor.setOption("theme", "ambiance");
  }

  function buildErrorMessage(e) {

    if (typeof e === "string") {
      return e;
    }

    return e.line !== undefined && e.column !== undefined
    ? "Line " + e.line + ", column " + e.column + ": " + e.message
    : e.message;
  }
  $(document).on('keydown', '#contentbox', function(e) { 
    var keyCode = e.keyCode || e.which; 

    if (keyCode == 9) {

      e.preventDefault();
      go();
    }

  });



  function go() {

   var input =  editor.doc.getLine(editor.doc.getCursor().line).trim();

   var output;
   try {

     var response = scissr.transform(input);

     console.log(response);

     renderOutput(response);

   }
   catch(err) {
     console.log(err.message);

     $(".errorMessage").html(err.message);
     $("#errorBar").show();

   }
    
  }


  function resolveFormat(response){
    var type = response.header.generator;
    var obj = {};
    var content = response.body;

    if (type == "json") {
      content = vkbeautify.json(content,4);
      obj.mode = "javascript"
    }
    if (type == "xml") {
      obj.mode = "text/html"
      content = vkbeautify.xml(content,4);
    }

    obj.body = content;

    return obj;
  }

  function renderOutput(response){

    var obj = resolveFormat(response),
    line  = editor.doc.getCursor().line;

    editor.setOption("mode", obj.mode );

    editor.getDoc().replaceRange(obj.body,{line: line, ch: 0}, editor.doc.getCursor());
    editor.setCursor(line, 0);
  }




});