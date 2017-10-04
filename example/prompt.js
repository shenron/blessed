var blessed = require('../');

function createScreen() {
  var global = blessed.Screen.global;
  var screen = blessed.Screen.global || blessed.screen({ tput: true });

  if (!global) {
    screen.program.key('C-c', function() {
      return process.exit(0);
    });
  }

  return screen;
}


function createPrompt() {
  var screen = createScreen()
    , prompt = createPrompt.prompt;

  if (prompt) {
    prompt.detach();
    screen.append(prompt);
    return prompt;
  }

  prompt = createPrompt.prompt = blessed.form({
    parent: screen,
    hidden: true,
    content: '',
    width: 'half',
    height: 7,
    left: 'center',
    top: 'center',
    border: {
      type: 'ascii'
    },
    tags: true,
    keys: true
  });

  prompt._.input = blessed.textbox({
    parent: prompt,
    top: 3,
    height: 1,
    left: 2,
    right: 2,
    bg: 'black'
  });

  prompt._.okay = blessed.button({
    parent: prompt,
    top: 5,
    height: 1,
    left: 2,
    width: 6,
    content: 'Okay',
    align: 'center',
    bg: 'black',
    hoverBg: 'blue',
    autoFocus: false,
    mouse: true,
    style: {
      bg: "lightblack",
      focus: {
        bg: "lightblue"
      }
    }
  });

  prompt._.cancel = blessed.button({
    parent: prompt,
    top: 5,
    height: 1,
    shrink: true,
    left: 10,
    width: 8,
    content: 'Cancel',
    align: 'center',
    bg: 'black',
    hoverBg: 'blue',
    autoFocus: false,
    mouse: true,
    style: {
      bg: "lightblack",
      focus: {
        bg: "lightblue"
      }
    }
  });

  prompt._.type = function(text, value, callback) {
    var okay, cancel;

    if (!callback) {
      callback = value;
      value = '';
    }

    prompt.show();
    prompt.setContent(' ' + text);

    if (value) prompt._.input.value = value;

    screen.saveFocus();
    
    function done(submit) {
      var value = submit ? prompt._.input.getValue(): null;
      prompt._.input.clearValue();
      prompt.hide();
      screen.restoreFocus();
      prompt._.okay.removeListener('press', okay);
      prompt._.cancel.removeListener('press', cancel);
      screen.render();
      return callback(null, value);
    }

    prompt._.okay.on('press', okay = function() {
      done(true);
    });

    prompt._.cancel.on('press', cancel = function() {
      done(false);
    });

    prompt._.input.readInput();

    screen.render();
  };

  return prompt;
}

var prompt = createPrompt();

prompt._.type("Test Question?", "some value", function(err, res) {
  setTimeout(function() {
    console.log("question answered: err=" + err + ", res='" + res + "'");
  }, 100);
});


