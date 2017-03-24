

var pokemonMap = {};
var disableBool = false;
var versionChoice = 'x-y'

var effortPoints = 510;
var effortPointsMax = 510;
var selectedMoves = 0;
var abilitySelected = false;
var natureSelected = false;
var currentDisplayPokemon;
var currentNatureSelected;

var curEV = { hpEV: 0, atkEV: 0, defEV: 0, spAtkEV: 0, spDefEV: 0, speedEV: 0 };
var curBase = { hpBase: 0, atkBase: 0, defBase: 0, spAtkBase: 0, spDefBase: 0, speedBase: 0 };
var curNatureStat = { "hp": 1, "atk": 1, "def": 1, "spAtk": 1, "spDef": 1, "speed": 1 };


var savedMoves = [];

var allNatures = {
  'Adamant': { statUp: "atk", statDown: "spAtk" },
  "Bashful": { statUp: "spAtk", statDown: "spAtk" },
  "Bold": { statUp: "def", statDown: "atk" },
  "Brave": { statUp: "atk", statDown: "speed" },
  "Calm": { statUp: "spDef", statDown: "atk" },
  "Careful": { statUp: "spDef", statDown: "spAtk" },
  "Docile": { statUp: "def", statDown: "def" },
  "Gentle": { statUp: "spDef", statDown: "def" },
  "Hardy": { statUp: "atk", statDown: "atk" },
  "Hasty": { statUp: "speed", statDown: "def" },
  "Impish": { statUp: "def", statDown: "spAtk" },
  "Jolly": { statUp: "speed", statDown: "spAtk" },
  "Lax": { statUp: "def", statDown: "spDef" },
  "Lonely": { statUp: "atk", statDown: "def" },
  "Mild": { statUp: "spAtk", statDown: "def" },
  "Modest": { statUp: "spAtk", statDown: "atk" },
  "Naive": { statUp: "speed", statDown: "spDef" },
  "Naughty": { statUp: "atk", statDown: "spDef" },
  "Quiet": { statUp: "spAtk", statDown: "speed" },
  "Quirky": { statUp: "spDef", statDown: "spDef" },
  "Rash": { statUp: "spAtk", statDown: "spDef" },
  "Relaxed": { statUp: "def", statDown: "speed" },
  "Sassy": { statUp: "spDef", statDown: "speed" },
  "Serious": { statUp: "speed", statDown: "speed" },
  "Timid": { statUp: "speed", statDown: "atk" }
}



// $('.slider').slider(
//         { animate: true },
//         { min: 0 },
//         { max: 100 },
//         {change: function(event, ui) {
//             $('#p1').text($("#slider_caya").slider("value"));
//             $('#p2').text($("#slider_charity").slider("value"));
//             $('#p3').text($("#slider_artists").slider("value"));
//         }},
//         {slide: function(event, ui) {
//             $('#p1').text($("#slider_caya").slider("value"));
//             $('#p2').text($("#slider_charity").slider("value"));
//             $('#p3').text($("#slider_artists").slider("value"));
//         }}
//     );

$(document).on("click", ".pokemonMoves", function () {
  var currentState = $(this).prop("data-selected");
  // console.log(selectedMove);

  if (selectedMoves < 4 && !currentState) {
    $(this).prop("data-selected", true);
    $(this).css("background-color", "#cb4b16");
    savedMoves.push($(this).text()); //might want data value to pull
    selectedMoves++;
    $("#movBadge").text(4 - selectedMoves);
  }
  else if (currentState) {
    $(this).prop("data-selected", false);
    $(this).css("background-color", "#2aa198");
    var indexRemove = savedMoves.indexOf($(this).text());
    savedMoves.splice(indexRemove, 1);
    console.log(savedMoves);
    selectedMoves--;
    $("#movBadge").text(4 - selectedMoves);
  }
});

$(document).on("click", ".pokemonAbility", function () {
  var curentState = $(this).prop("data-selected");
  // console.log(selectedAbility,abilitySelected);

  if (!abilitySelected && !curentState) {
    abilitySelected = true;
    $(this).prop("data-selected", true);
    $(this).css("background-color", "#cb4b16");
    $("#abiBadge").text(0);
  }
  else if (curentState) {
    abilitySelected = false;
    $(this).prop("data-selected", false);
    $(this).css("background-color", "#2aa198");
    $("#abiBadge").text(1);
  }
});

$(document).on("click", ".pokemonNature", function () {
  var curentState = $(this).prop("data-selected");
  // console.log(selectedAbility,abilitySelected);

  if (!natureSelected && !curentState) {
    // var selectedNature = 
    natureSelected = true;
    $(this).prop("data-selected", true);
    $(this).css("background-color", "#cb4b16");
    $("#natureBadge").text(0);
    currentNatureSelected = $(this).attr("id");


    curNatureStat[allNatures[currentNatureSelected].statUp] = 1.1;
    curNatureStat[allNatures[currentNatureSelected].statDown] = .9;
    console.log(curNatureStat);
  }
  else if (curentState) {
    curNatureStat = { "hp": 1, "atk": 1, "def": 1, "spAtk": 1, "spDef": 1, "speed": 1 };
    natureSelected = false;
    $(this).prop("data-selected", false);
    $(this).css("background-color", "#2aa198");
    $("#natureBadge").text(1);
  }
  statUpdate();
});



$(document).on("change paste keyup", ".statInputBox", function () {
  //might change to when they finish typing
  // console.log(Math.ceil($(this).val() / 4),parseInt($("#hpStat").text()) );

  //calulation of stats as i understand  I will put 30 in for IV which i think is the best
  // 
  // HP - ((( 2* base + iv + (ev/4) * level) / 100 ) + level +10)
  // Other stats - (((2 * base + iv + (ev / 4) * level)/100)+5)*nature

  var inputAmount = Math.floor($(this).val());

  if (inputAmount > 252) {
    inputAmount = 252;
    $(this).val(252)
  }
  else if (inputAmount < 0) {
    inputAmount = 0;
    $(this).val(0)
  }


  var statToChange = $(this).attr("id");
  var curEVChange

  if (inputAmount == 0) {
    curEVChange = 0;
  }
  else {
    curEVChange = Math.floor((inputAmount / 4));
  }

  switch (statToChange) {
    case 'hpInput':
      curEV.hpEV = curEVChange;
      break;
    case 'atkInput':
      curEV.atkEV = curEVChange;
      break;
    case 'defInput':
      curEV.defEV = curEVChange;
      break;
    case 'spAtkInput':
      curEV.spAtkEV = curEVChange;
      break;
    case 'spDefInput':
      curEV.spDefEV = curEVChange;
      break;
    case 'speedInput':
      curEV.speedEV = curEVChange;
      break;
  }

  var evTotal = 508;

  for (var key in curEV) {
    evTotal -= curEV[key] * 4;
  }

  $("#statBadge").text(evTotal);
  $("#evRemain").text(evTotal);
  statUpdate()

});

function statUpdate() {
  // var curNature = 1;

  currentPokemonHp = Math.floor((2 * curBase.hpBase + 31 + curEV.hpEV) + 110);
  currentPokemonAtk = Math.floor(((2 * curBase.atkBase + 31 + curEV.atkEV) + 5) * curNatureStat.atk);
  currentPokemonDef = Math.floor(((2 * curBase.defBase + 31 + curEV.defEV) + 5) * curNatureStat.def);
  currentPokemonSpAtk = Math.floor(((2 * curBase.spAtkBase + 31 + curEV.spAtkEV) + 5) * curNatureStat.spAtk);
  currentPokemonSpDef = Math.floor(((2 * curBase.spDefBase + 31 + curEV.spDefEV) + 5) * curNatureStat.spDef);
  currentPokemonSpeed = Math.floor(((2 * curBase.speedBase + 31 + curEV.speedEV) + 5) * curNatureStat.speed);


  $("#hpStat").text(currentPokemonHp);
  $("#atkStat").text(currentPokemonAtk);
  $("#defStat").text(currentPokemonDef);
  $("#spAtkStat").text(currentPokemonSpAtk);
  $("#spDefStat").text(currentPokemonSpDef);
  $("#speedStat").text(currentPokemonSpeed);
}


// --------------------------------------------------------
// Search handler
// --------------------------------------------------------

// $("#search-button").on("click",function() {
$(document).on("click", "#search-button", function () {

  var pokemonToFind = $("#search-param").val().trim().toLowerCase();
  searchHandler(pokemonToFind);
});

// on hitting enter
$(document).keypress(function (e) {
  if (e.which == 13) {
    var pokemonToFind = $("#search-param").val().trim().toLowerCase();
    searchHandler(pokemonToFind);
  }
});

$(document).on("click", ".pokemonPanel", function () {
  currentDisplayPokemon = $(this).attr("pokemonName");
  savedMoves = [];
  choosePokemon($(this).attr("pokemonName"));
});



//allows for array to be passed
function searchHandler(arr) {

  var pokemonToSearch = arr;

  // for (var i = 0; i < pokemonToSearch.length; i++) {

  var curPokemon = arr;//pokemonToSearch[i];

  if (!disableBool) {

    // var indexPokemon = alreadySearched.indexOf(curPokemon);

    if (curPokemon != "") {// && indexPokemon == -1) {
      apiRequest("pokemon", curPokemon);
      $("#search-param").val("");
      $("#search-param").attr('disabled', '""');
      $("#search-param").attr('placeholder', 'Please Wait');
    }
    //updates placeholder if pokemon has previously been searched
    else if (indexPokemon != -1) {
      $("#search-param").val("");
      $("#search-param").attr('placeholder', 'Please choose a new pokemon');
      disableBool = false;
    }
  }
  // }
}


function displayPokemon(pokemonToDisplay) {

  var pokemonPanel = $("<div>");
  pokemonPanel.attr("class", "panel panel-primary pokemonPanel");
  //creates inner div of the panel
  var panelBody = $("<div>");
  panelBody.attr("class", "panel-body");

  //creates header of panel for pokemon name
  var panelHeader = $("<div>");
  panelHeader.attr("class", "panel-heading");

  var curPokemonName = capitalizeFirstLetter(pokemonToDisplay.name);
  panelHeader.text(curPokemonName);

  var topRow = $("<div>");
  topRow.attr("class", "row pokemonPicture text-center");


  //creates img that is used for display
  var pokemonImage = $("<img>");
  pokemonImage.attr("src", "assets/images/" + pokemonToDisplay.gifFront);
  pokemonImage.attr("class", "displayImage");
  topRow.append(pokemonImage);
  panelBody.append(topRow);
  var bottomRow = $("<div>");
  bottomRow.attr("class", "row pokemonTypes text-center");
  pokeType = pokemonToDisplay.types;


  for (var i = 0; i < pokeType.length; i++) {
    var typeHolder = $("<span>");
    typeHolder.attr('class', 'pokemonType label');
    var color = typeColor(pokeType[i]);
    typeHolder.css("background-color", color);

    typeHolder.text(capitalizeFirstLetter(pokeType[i]));
    bottomRow.append(typeHolder);
  }
  panelBody.append(bottomRow);

  // --------------------------------------------------------
  // APPEND TO DOCUMENT
  // --------------------------------------------------------
  //appends all of the elements together to display 

  pokemonPanel.attr("pokemonName", pokemonToDisplay.name);
  pokemonPanel.append(panelHeader);
  pokemonPanel.append(panelBody);
  $("#pokemonSpot").append(pokemonPanel);
  $("#search-param").val("");
  $("#search-param").removeAttr('disabled');
  $("#search-param").attr('placeholder', 'Pokemon name or number');
  disableBool = false;
}


function apiRequest(type, val) {
  var cururl;
  var queryURL = "https://pokeapi.co/api/v2/";

  if (type == 'pokemon') {
    queryURL += "pokemon/" + val;
  }

  $.ajax({
    url: (queryURL),
    method: "GET"
  }).done(function (response) {
    //returns name and picture from API
    var pokemonName = response.name;

    // --------------------------------------------------------
    // Pokemon Moves
    // --------------------------------------------------------
    var pokemonMoves = response.moves;
    var tempMoveObj = {};
    var tempMoveArray = []
    for (var i = 0; i < pokemonMoves.length; i++) {

      var curMoveName = pokemonMoves[i].move.name;
      var curMoveUrl = pokemonMoves[i].move.url;
      var gameArray = [];

      for (var j = 0; j < pokemonMoves[i].version_group_details.length; j++) {
        gameArray.push(pokemonMoves[i].version_group_details[j].version_group.name);
      }

      tempMoveObj[curMoveName] = {
        games: gameArray,
        moveURL: curMoveUrl,
        moveName: curMoveName
      };
      tempMoveArray.push({
        games: gameArray,
        moveURL: curMoveUrl,
        moveName: curMoveName
      });


    }
    // --------------------------------------------------------
    // Pokemon Abilities
    // --------------------------------------------------------
    var tempAbilityArray = [];
    var pokemonAbilities = response.abilities;
    for (var i = 0; i < pokemonAbilities.length; i++) {

      var curAbility = pokemonAbilities[i].ability.name;
      var curAbilityURL = pokemonAbilities[i].ability.url;

      tempAbilityArray.push({
        abilityURL: curAbilityURL,
        abilityName: curAbility
      });
    }

    // --------------------------------------------------------
    // Pokemon Stats
    // --------------------------------------------------------
    var pokemonStats = response.stats;
    var tempStatObj = {};

    for (var i = 0; i < pokemonStats.length; i++) {

      var curStat = pokemonStats[i].stat.name;
      var statEffort = pokemonStats[i].effort;
      var statBase = pokemonStats[i].base_stat;

      tempStatObj[curStat] = {
        effort: statEffort,
        base_stat: statBase
      };
    }

    // --------------------------------------------------------
    // Pokemon Types
    // --------------------------------------------------------
    var pokemonTypes = response.types;
    var tempTypeArray = [];

    for (var i = 0; i < pokemonTypes.length; i++) {

      var curType = pokemonTypes[i].type.name;

      tempTypeArray.push(curType);
    }


    // --------------------------------------------------------
    // Pokemon Object
    // --------------------------------------------------------
    pokemonMap[pokemonName] = {
      moves: tempMoveArray,
      stats: tempStatObj,
      abilities: tempAbilityArray,
      gifFront: pokemonName + ".gif",
      pokemonNumber: response.id,
      types: tempTypeArray,
      name: pokemonName
    };

    console.log(pokemonMap);

    displayPokemon(pokemonMap[pokemonName]);

  });
}

function choosePokemon(pokemon) {
  var curPokemonMoves = pokemonMap[pokemon].moves;
  $("#movBadge").text(4);
  $("#abiBadge").text(1);
  $("#natureBadge").text(1);
  $("#statBadge").text(508);
  selectedMoves = 0;
  abilitySelected = false;
  natureSelected = false;

  $("#natureChoices").empty();
  $("#moveChoices").empty();
  var moveCount = 0;

  for (var i = 0; i < curPokemonMoves.length; i++) {

    var moveSpan = $("<button>");
    moveSpan.prop("data-selected", false);
    moveSpan.attr("class", "btn btn-xs btn-success pokemonMoves");
    moveSpan.text(curPokemonMoves[i].moveName);
    var versionIndex = curPokemonMoves[i].games.indexOf(versionChoice);
    if (versionIndex != -1) {
      $("#moveChoices").append(moveSpan);
      moveCount++;
    }
  }
  // $("#movBadge").text(moveCount);

  console.log('Moves available in', versionChoice, moveCount, '/', curPokemonMoves.length);

  var curPokemonAbilities = pokemonMap[pokemon].abilities;
  $("#abilityChoices").empty();

  var abilityCount = 0;

  for (var i = 0; i < curPokemonAbilities.length; i++) {

    var abilitySpan = $("<button>");
    abilitySpan.attr("class", "btn btn-xs btn-success pokemonAbility");
    abilitySpan.text(curPokemonAbilities[i].abilityName);
    abilitySpan.prop("data-selected", false);
    $("#abilityChoices").append(abilitySpan);
    abilityCount++;
  }

  // $("#abiBadge").text(abilityCount);
  for (var key in allNatures) {
    var natureButton = $("<button>");
    natureButton.attr("class", "btn btn-xs btn-success pokemonNature");
    natureButton.text(key);
    natureButton.attr("id", key);
    natureButton.prop("data-selected", false);
    $("#natureChoices").append(natureButton);
  }

  var curPokemonStats = pokemonMap[pokemon].stats;
  $("#statHolder").empty();

  var topRow = $("<div>");
  var hpDiv = $("<div>");
  var atkDiv = $("<div>");
  var defDiv = $("<div>");
  var spAtkDiv = $("<div>");
  var spDefDiv = $("<div>");
  var speedDiv = $("<div>");

  topRow.attr("class", "row");
  hpDiv.attr("class", "row");
  atkDiv.attr("class", "row");
  defDiv.attr("class", "row");
  spAtkDiv.attr("class", "row");
  spDefDiv.attr("class", "row");
  speedDiv.attr("class", "row");

  var topRowLeft = $("<div>");
  var topRowMid = $("<div>");
  var topRowRight = $("<div>");
  topRowLeft.attr("class", "col-sm-4");
  topRowMid.attr("class", "col-sm-4");
  topRowRight.attr("class", "col-sm-4");
  var topRowLabel = $("<span>");
  topRowLabel.attr("class", "label label-default statBox  ");
  topRowLabel.text("EV Points left:");
  var topRowEVs = $("<span>");
  topRowEVs.attr("class", "label label-primary statBox evSpot");
  topRowEVs.attr("id", "evRemain");
  topRowEVs.text("508");

  topRowLeft.append(topRowLabel);
  topRowMid.append(topRowEVs);
  // topRow.attr("class","evSpot");
  topRow.append(topRowLeft);
  topRow.append(topRowMid);

  // --------------------------------------------------------
  // Pokemon STAT LABEL
  // --------------------------------------------------------

  var hpStatCol = $("<div>");
  var atkStatCol = $("<div>");
  var defStatCol = $("<div>");
  var spAtkStatCol = $("<div>");
  var spDefStatCol = $("<div>");
  var speedStatCol = $("<div>");
  hpStatCol.attr("class", "col-sm-4");
  atkStatCol.attr("class", "col-sm-4");
  defStatCol.attr("class", "col-sm-4");
  spAtkStatCol.attr("class", "col-sm-4");
  spDefStatCol.attr("class", "col-sm-4");
  speedStatCol.attr("class", "col-sm-4");

  var hpStat = $("<span>");
  var atkStat = $("<span>");
  var defStat = $("<span>");
  var spAtkStat = $("<span>");
  var spDefStat = $("<span>");
  var speedStat = $("<span>");

  hpStat.attr("id", "hpStat");
  atkStat.attr("id", "atkStat");
  defStat.attr("id", "defStat");
  spAtkStat.attr("id", "spAtkStat");
  spDefStat.attr("id", "spDefStat");
  speedStat.attr("id", "speedStat");

  var hpLabel = $("<span>");
  var atkLabel = $("<span>");
  var defLabel = $("<span>");
  var spAtkLabel = $("<span>");
  var spDefLabel = $("<span>");
  var speedLabel = $("<span>");

  hpLabel.attr("class", "label label-default statBox");
  atkLabel.attr("class", "label label-default statBox");
  defLabel.attr("class", "label label-default statBox");
  spAtkLabel.attr("class", "label label-default statBox");
  spDefLabel.attr("class", "label label-default statBox");
  speedLabel.attr("class", "label label-default statBox");

  hpLabel.text("HP: ");
  atkLabel.text("Attack: ");
  defLabel.text("Defense: ");
  spAtkLabel.text("Special Attack: ");
  spDefLabel.text("Special Defense: ");
  speedLabel.text("Speed: ");

  hpLabel.append(hpStat);
  atkLabel.append(atkStat);
  defLabel.append(defStat);
  spAtkLabel.append(spAtkStat);
  spDefLabel.append(spDefStat);
  speedLabel.append(speedStat);

  hpStatCol.append(hpLabel);
  atkStatCol.append(atkLabel);
  defStatCol.append(defLabel);
  spAtkStatCol.append(spAtkLabel);
  spDefStatCol.append(spDefLabel);
  speedStatCol.append(speedLabel);

  hpDiv.append(hpStatCol);
  atkDiv.append(atkStatCol);
  defDiv.append(defStatCol);
  spAtkDiv.append(spAtkStatCol);
  spDefDiv.append(spDefStatCol);
  speedDiv.append(speedStatCol);


  // --------------------------------------------------------
  // Pokemon STAT INPUT
  // --------------------------------------------------------
  var hpInput = $("<input>");
  var atkInput = $("<input>");
  var defInput = $("<input>");
  var spAtkInput = $("<input>");
  var spDefInput = $("<input>");
  var speedInput = $("<input>");

  hpInput.attr("class", "input-sm statInputBox");
  atkInput.attr("class", "input-sm statInputBox");
  atkInput.attr("class", "input-sm statInputBox");
  defInput.attr("class", "input-sm statInputBox");
  spAtkInput.attr("class", "input-sm statInputBox");
  spDefInput.attr("class", "input-sm statInputBox");
  speedInput.attr("class", "input-sm statInputBox");

  hpInput.attr("id", "hpInput");
  atkInput.attr("id", "atkInput");
  defInput.attr("id", "defInput");
  spAtkInput.attr("id", "spAtkInput");
  spDefInput.attr("id", "spDefInput");
  speedInput.attr("id", "speedInput");

  hpInput.attr("max", "252");
  atkInput.attr("max", "252");
  defInput.attr("max", "252");
  spAtkInput.attr("max", "252");
  spDefInput.attr("max", "252");
  speedInput.attr("max", "252");


  hpInput.attr("min", "0");
  atkInput.attr("min", "0");
  defInput.attr("min", "0");
  spAtkInput.attr("min", "0");
  spDefInput.attr("min", "0");
  speedInput.attr("min", "0");


  hpInput.attr("type", "text");
  atkInput.attr("type", "text");
  defInput.attr("type", "text");
  spAtkInput.attr("type", "text");
  spDefInput.attr("type", "text");
  speedInput.attr("type", "text");

  hpInput.attr("placeholder", "0");
  atkInput.attr("placeholder", "0");
  defInput.attr("placeholder", "0");
  spAtkInput.attr("placeholder", "0");
  spDefInput.attr("placeholder", "0");
  speedInput.attr("placeholder", "0");

  var hpInputCol = $("<div>");
  var atkInputCol = $("<div>");
  var defInputCol = $("<div>");
  var spAtkInputCol = $("<div>");
  var spDefInputCol = $("<div>");
  var speedInputCol = $("<div>");
  hpInputCol.attr("class", "col-sm-2");
  atkInputCol.attr("class", "col-sm-2");
  defInputCol.attr("class", "col-sm-2");
  spAtkInputCol.attr("class", "col-sm-2");
  spDefInputCol.attr("class", "col-sm-2");
  speedInputCol.attr("class", "col-sm-2");

  hpInputCol.append(hpInput);
  atkInputCol.append(atkInput);
  defInputCol.append(defInput);
  spAtkInputCol.append(spAtkInput);
  spDefInputCol.append(spDefInput);
  speedInputCol.append(speedInput);

  hpDiv.append(hpInputCol);
  atkDiv.append(atkInputCol);
  defDiv.append(defInputCol);
  spAtkDiv.append(spAtkInputCol);
  spDefDiv.append(spDefInputCol);
  speedDiv.append(speedInputCol);


  // --------------------------------------------------------
  // Pokemon STAT SLIDER
  // --------------------------------------------------------

  var hpSliderCol = $("<div>");
  var atkSliderCol = $("<div>");
  var defSliderCol = $("<div>");
  var spAtkSliderCol = $("<div>");
  var spDefSliderCol = $("<div>");
  var speedSliderCol = $("<div>");

  var hpSlider = $("<div>");
  var atkSlider = $("<div>");
  var defSlider = $("<div>");
  var spAtkSlider = $("<div>");
  var spDefSlider = $("<div>");
  var speedSlider = $("<div>");

  hpSlider.attr("class", "selector inactive");
  atkSlider.attr("class", "selector inactive");
  defSlider.attr("class", "selector inactive");
  spAtkSlider.attr("class", "selector inactive");
  spDefSlider.attr("class", "selector inactive");
  speedSlider.attr("class", "selector inactive");

  // <input id="ex1" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="20" data-slider-step="1" data-slider-value="14"/>

  hpSlider.attr("id", "hpSlider");
  atkSlider.attr("id", "atkSlider");
  defSlider.attr("id", "defSlider");
  spAtkSlider.attr("id", "spAtkSlider");
  spDefSlider.attr("id", "spDefSlider");
  speedSlider.attr("id", "speedSlider");

  hpSlider.attr("data-slider-id", "hpSliderData");
  atkSlider.attr("data-slider-id", "atkSliderData");
  defSlider.attr("data-slider-id", "defSliderData");
  spAtkSlider.attr("data-slider-id", "spAtkSliderData");
  spDefSlider.attr("data-slider-id", "spDefSliderData");
  speedSlider.attr("data-slider-id", "speedSliderData");

  // hpSlider.attr("type","text");
  // atkSlider.attr("type","text");
  // defSlider.attr("type","text");
  // spAtkSlider.attr("type","text");
  // spDefSlider.attr("type","text");
  // speedSlider.attr("type","text");

  hpSlider.attr("data-slider-min", "0");
  atkSlider.attr("data-slider-min", "0");
  defSlider.attr("data-slider-min", "0");
  spAtkSlider.attr("data-slider-min", "0");
  spDefSlider.attr("data-slider-min", "0");
  speedSlider.attr("data-slider-min", "0");

  hpSlider.attr("data-slider-max", "256");
  atkSlider.attr("data-slider-max", "256");
  defSlider.attr("data-slider-max", "256");
  spAtkSlider.attr("data-slider-max", "256");
  spDefSlider.attr("data-slider-max", "256");
  speedSlider.attr("data-slider-max", "256");

  hpSlider.attr("data-slider-step", "1");
  atkSlider.attr("data-slider-step", "1");
  defSlider.attr("data-slider-step", "1");
  spAtkSlider.attr("data-slider-step", "1");
  spDefSlider.attr("data-slider-step", "1");
  speedSlider.attr("data-slider-step", "1");

  hpSlider.attr("data-slider-value", "0");
  atkSlider.attr("data-slider-value", "0");
  defSlider.attr("data-slider-value", "0");
  spAtkSlider.attr("data-slider-value", "0");
  spDefSlider.attr("data-slider-value", "0");
  speedSlider.attr("data-slider-value", "0");

  hpSliderCol.attr("class", "col-sm-5");
  atkSliderCol.attr("class", "col-sm-5");
  defSliderCol.attr("class", "col-sm-5");
  spAtkSliderCol.attr("class", "col-sm-5");
  spDefSliderCol.attr("class", "col-sm-5");
  speedSliderCol.attr("class", "col-sm-5");

  hpSliderCol.append(hpSlider);
  atkSliderCol.append(atkSlider);
  defSliderCol.append(defSlider);
  spAtkSliderCol.append(spAtkSlider);
  spDefSliderCol.append(spDefSlider);
  speedSliderCol.append(speedSlider);

  hpDiv.append(hpSliderCol);
  atkDiv.append(atkSliderCol);
  defDiv.append(defSliderCol);
  spAtkDiv.append(spAtkSliderCol);
  spDefDiv.append(spDefSliderCol);
  speedDiv.append(speedSliderCol);

  $("#statHolder").append(topRow);
  $("#statHolder").append(hpDiv);
  $("#statHolder").append(atkDiv);
  $("#statHolder").append(defDiv);
  $("#statHolder").append(spAtkDiv);
  $("#statHolder").append(spDefDiv);
  $("#statHolder").append(speedDiv);

  curEV = { hpEV: 0, atkEV: 0, defEV: 0, spAtkEV: 0, spDefEV: 0, speedEV: 0 };
  curBase.hpBase = curPokemonStats.hp.base_stat;
  curBase.atkBase = curPokemonStats.attack.base_stat;
  curBase.defBase = curPokemonStats.defense.base_stat;
  curBase.spAtkBase = curPokemonStats["special-attack"].base_stat;
  curBase.spDefBase = curPokemonStats["special-defense"].base_stat;
  curBase.speedBase = curPokemonStats.speed.base_stat;
  statUpdate();
}

// $('#hpSlider').bootstrapSlider({
//   formatter: function(value) {
//     return 'Current value: ' + value;
//   }
// });



function typeColor(type) {

  switch (type) {
    case 'fire':
      return '#9C531F';
      break;
    case 'normal':
      return '#6D6D4E';
      break;
    case 'fighting':
      return '#7D1F1A';
      break;
    case 'water':
      return '#445E9C';
      break;
    case 'flying':
      return '#6D5E9C';
      break;
    case 'grass':
      return '#78C850';
      break;
    case 'poison':
      return '#A040A0';
      break;
    case 'electric':
      return '#F8D030';
      break;
    case 'ground':
      return '#E0C068';
      break;
    case 'psychic':
      return '#F85888';
      break;
    case 'rock':
      return '#B8A038';
      break;
    case 'ice':
      return '#98D8D8';
      break;
    case 'bug':
      return '#A8B820';
      break;
    case 'dragon':
      return '#7038F8';
      break;
    case 'ghost':
      return '#705898';
      break;
    case 'dark':
      return '#705848';
      break;
    case 'steel':
      return '#B8B8D0';
      break;
    case 'fairy':
      return '#EE99AC';
      break;
    default:
      return '#14e8e4';
  }
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
