//
// RPG Dice
// Dice rolling tools adapted to my needs for various RPG games
// Adapted from Online Die Roller (2005) by Brock H. Jones
//

//-----------------------------------------------------------------------------
// docreset()
//
// Reset the form to the original values  
//-----------------------------------------------------------------------------
function docreset() {
  document.getElementById('diceBag').reset();
  document.getElementById('rollhistory').value = ""
}


//-----------------------------------------------------------------------------
// rollValidate()
//
// Make sure that the form entries are valid
//-----------------------------------------------------------------------------
function rollValidate(sides) {
  var frm = document.getElementById('diceBag');
  var dice = eval('frm.d' + sides + 'n');

  // Make sure the # of dice is valid
  if (dice.value != parseInt(dice.value) ||
    parseInt(dice.value) <= 0) {
    alert('Number of dice must be an positive integer greater than 1.');
    return false;
  }

  return true;
}


//-----------------------------------------------------------------------------
// rollDn()
//   
// For any value of sides, the following tags must exist
//  eg. sides = 20
//   d20n  = Text field with the number of dice
//   d20mo = Select field with the modifier number
//   d20m  = Radio button with the sign of the modifier
//
//   runningtotal = Textarea for the roll history
//
// Args: The number of die sides
//
// Returns: None
//-----------------------------------------------------------------------------
function rollDn(sides) {
  var frm = document.getElementById('diceBag')
  var dice = eval('frm.d' + sides + 'n');
  var modifier = eval('frm.d' + sides + 'mo');
  var results = eval('frm.d' + sides + 'r');
  var sign = eval('frm.d' + sides + 'm[frm.d' + sides + 'm.selectedIndex].value');

  if (!rollValidate(sides))
    return;

  var rand = new Array();

  // Roll the dice
  for (var i = 0; i < dice.value; i++) {
    rand[rand.length] = Math.floor((Math.random() * sides) + 1);
  }

  // Add em up
  results.value = eval(rand.join('+', rand) + sign + modifier.value);

  // Add to the history
  
  frm.rollhistory.value =
    dice.value + 'd' + sides + sign + modifier.value + '\n' +
    rand.join(',', rand) + sign + modifier.value + ' = ' + results.value +
    '\n\n' + frm.rollhistory.value;
    addToRollBuilder(rollString);
}


//-----------------------------------------------------------------------------
// parseCookie()
//
// 
//-----------------------------------------------------------------------------
function parseCookie() {
  var ar = new Array();
  var c = document.cookie.substring(document.cookie.indexOf('=') + 1, document.cookie.length).split('_');

  for (var i = 0; i < c.length; i++) {
    ar[c[i].substring(0, document.cookie.indexOf('='))] = c[i].substring(c[i].indexOf('=') + 1, c[i].length).split(',');

  }

  return ar;
}


//-----------------------------------------------------------------------------
// readSaved()
//
// 
//-----------------------------------------------------------------------------
function readSaved() {
  ar = parseCookie();

  var frm = document.getElementById('diceBag')
  var names = new Array();

  for (a in ar) {
    names[names.length] = a;
    alert('a: ' + a + '\nar: ' + ar[a]);
  }

  names.sort();

  for (var i = frm.saved_rolls.length - 1; i >= 0; i--) {
    frm.saved_rolls[i] = null;
  }

  for (var i = 0; i < names.length; i++) {
    frm.saved_rolls[i] = new Option(i, i);
  }

  return names;
}


//-----------------------------------------------------------------------------
// loadSaved()
//
// 
//-----------------------------------------------------------------------------
function loadSaved(savedName) {
  ar = parseCookie();

  var frm = document.getElementById('diceBag')

  if (!ar[savedName]) {
    alert('Unknown saved.');
    return;
  }

  var selectReg = new RegExp("d\{d}+mo");

  for (var i = 0; i < ar[savedName]; i += 2) {
    if (selectReg.exec(ar[savedName][i])) {
      // It's a select


    } else {
      // Just a text box
      eval(ar[savedName][i] + '.value = ar[savedName][i + 1]');
    }
  }
}


//-----------------------------------------------------------------------------
// saveRoll()
//
// 
//-----------------------------------------------------------------------------
function saveRoll() {
  var defaultNumberOfDice = 1;
  var defaultModifier = 0;
  var defaultSign = '+';
  var saveSides = new Array('4', '6', '8', '10', '12', '20', '100');

  var frm = document.getElementById('diceBag')
  var new_save = new Array();

  for (var i = 0; i < saveSides.length; i++) {
    var n = eval('frm.d' + saveSides[i] + 'n.value');
    var mo = eval('frm.d' + saveSides[i] + 'mo.value');
    var m = eval('frm.d' + saveSides[i] + 'm[frm.d' + saveSides[i] + 'm.selectedIndex].value');

    if (n != defaultNumberOfDice) {
      new_save[new_save.length] = 'd' + saveSides[i] + 'n,' + n;
    }

    if (mo != defaultModifier) {
      new_save[new_save.length] = 'd' + saveSides[i] + 'mo,' + mo
    }

    if (m != defaultSign) {
      new_save[new_save.length] = 'd' + saveSides[i] + 'm,' + mo
    }
  }

  var date = new Date();
  date.setFullYear(date.getFullYear() + 10);

  //  var ar = readSaved();
  var ar = new Array();

  for (var i = frm.saved_rolls.length - 1; i >= 0; i--) {
    frm.saved_rolls[i] = null;
  }

  ar[frm.save_name.value] = new_save;
  var s;

  for (a in ar) {
    frm.saved_rolls[frm.saved_rolls.length] = new Option(a, a);

  }

  //  document.cookie = 'name=' + stuff + ';expires=' + date.toGMTString();
  alert(document.cookie);

  parseCookie();

}