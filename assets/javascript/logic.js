

var pokemonMap = {};
var disableBool = false;

// --------------------------------------------------------
// Search handler
// --------------------------------------------------------

// $("#search-button").on("click",function() {
  $(document).on("click","#search-button",function() {
      
      var pokemonToFind = $("#search-param").val().trim().toLowerCase();
      searchHandler(pokemonToFind);
  });

  // on hitting enter
  $(document).keypress(function(e) {
    if(e.which == 13) {
        var pokemonToFind = $("#search-param").val().trim().toLowerCase();
      searchHandler(pokemonToFind);
    }
});

  $(document).on("click",".pokemonPanel",function() {
      choosePokemon($(this).attr("pokemonName"));
  });



  //allows for array to be passed
    function searchHandler (arr) {
      
      var pokemonToSearch = arr;

      // for (var i = 0; i < pokemonToSearch.length; i++) {

        var curPokemon = arr;//pokemonToSearch[i];

           if (!disableBool) {
 
              // var indexPokemon = alreadySearched.indexOf(curPokemon);

              if (curPokemon!= "") {// && indexPokemon == -1) {
                apiRequest("pokemon",curPokemon);
                $("#search-param").val("");
                $("#search-param").attr('disabled','""');
                $("#search-param").attr('placeholder','Please Wait');
              }
                //updates placeholder if pokemon has previously been searched
              else if (indexPokemon != -1) {
                $("#search-param").val("");
                $("#search-param").attr('placeholder','Please choose a new pokemon');
                disableBool = false;
              }
            }
        // }
    }


function displayPokemon(pokemonToDisplay) {

        var pokemonPanel = $("<div>");
        pokemonPanel.attr("class","panel panel-primary pokemonPanel");
        //creates inner div of the panel
        var panelBody = $("<div>");
        panelBody.attr("class","panel-body");
        
        //creates header of panel for pokemon name
        var panelHeader = $("<div>");
        panelHeader.attr("class","panel-heading");

        var curPokemonName = capitalizeFirstLetter(pokemonToDisplay.name);
        panelHeader.text(curPokemonName);

        var topRow = $("<div>");
        topRow.attr("class","row pokemonPicture text-center");
        // pokemonBlockBody.attr("class","pokemonInfo")


        //creates the hidden context menu for when user hovers over
        // var hoverLookBox = $("<div>");
        // hoverLookBox.attr("class","hoverLook");
        // var hoverLookText = $("<div>");
        // hoverLookText.attr("class","text");
        // var hoverLookGlyph = $("<span>");
        
        // hoverLookGlyph.attr("class","glyphicon glyphicon-search");
        // hoverLookGlyph.attr("aria-hidden","true");
        // hoverLookText.append(hoverLookGlyph);
        // hoverLookBox.append(hoverLookText);

        // var hoverSaveBox = $("<div>");
        // hoverSaveBox.attr("class","hoverSave");
        // var hoverSaveText = $("<div>");
        // hoverSaveText.attr("class","text");

        // var hoverSaveGlyph = $("<span>");
        // hoverSaveGlyph.attr("class","glyphicon glyphicon-floppy-save");
        // hoverSaveGlyph.attr("aria-hidden","true");
        // hoverSaveText.append(hoverSaveGlyph);
        // hoverSaveBox.append(hoverSaveText);

       
        //creates img that is used for display
        var pokemonImage = $("<img>");
        pokemonImage.attr("src", "assets/images/" + pokemonToDisplay.gifFront);
        // pokemonImage.attr('width',"150px");
        // pokemonImage.attr('height','150px');
        pokemonImage.attr("class","displayImage");
        topRow.append(pokemonImage);
        panelBody.append(topRow);

        var bottomRow = $("<div>");
        bottomRow.attr("class","row pokemonTypes text-center");


        pokeType = pokemonToDisplay.types;
  

        for (var i = 0; i < pokeType.length; i++) {
          var typeHolder = $("<h6>");
          typeHolder.attr('class','pokemonType');
          typeHolder.text(capitalizeFirstLetter(pokeType[i]));
          bottomRow.append(typeHolder);
        }
        panelBody.append(bottomRow);

        // --------------------------------------------------------
        // APPEND TO DOCUMENT
        // --------------------------------------------------------
        //appends all of the elements together to display 
        
        

        pokemonPanel.attr("pokemonName",pokemonToDisplay.name);
       

        pokemonPanel.append(panelHeader);
        pokemonPanel.append(panelBody);
        $("#pokemonSpot").append(pokemonPanel);


  $("#search-param").val("");
  $("#search-param").removeAttr('disabled');
  $("#search-param").attr('placeholder','Pokemon name or number');
  disableBool = false;
}


function apiRequest(type,val) {
  var cururl;
  var queryURL =  "https://pokeapi.co/api/v2/";

  if (type == 'pokemon') {
    queryURL += "pokemon/" + val;
  }

  $.ajax({
        url: (queryURL),
        method: "GET"
      }).done(function(response) { 
          //returns name and picture from API
        var pokemonName = response.name;
        
        // --------------------------------------------------------
        // Pokemon Moves
        // --------------------------------------------------------
        var pokemonMoves = response.moves;
         var tempMoveObj = {}; 
         var tempMoveArray = []
         for(var i =0; i < pokemonMoves.length; i++) {
        
            var curMoveName = pokemonMoves[i].move.name;
            var curMoveUrl = pokemonMoves[i].move.url;
            var gameArray = [];

            for (var j = 0; j < pokemonMoves[i].version_group_details.length; j++ ) {
               gameArray.push(pokemonMoves[i].version_group_details[j].version_group.name);
            }
    
            tempMoveObj[curMoveName] = {games:    gameArray,
                                        moveURL:  curMoveUrl,
                                        moveName: curMoveName};
             tempMoveArray.push( {games:    gameArray,
                                        moveURL:  curMoveUrl,
                                        moveName: curMoveName});


          }
        // --------------------------------------------------------
        // Pokemon Abilities
        // --------------------------------------------------------
        var tempAbilityArray = [];
        var pokemonAbilities = response.abilities;
        for(var i =0; i < pokemonAbilities.length; i++) {
     
            var curAbility = pokemonAbilities[i].ability.name;
            var curAbilityURL = pokemonAbilities[i].ability.url;
    
            tempAbilityArray.push({abilityURL: curAbilityURL,
                                    abilityName: curAbility});
          }

        // --------------------------------------------------------
        // Pokemon Stats
        // --------------------------------------------------------
        var pokemonStats = response.stats;
        var tempStatObj = {};

        for(var i =0; i < pokemonStats.length; i++) {
  
            var curStat = pokemonStats[i].stat.name;
            var statEffort = pokemonStats[i].effort;
            var statBase = pokemonStats[i].base_stat;

            tempStatObj[curStat] = {  effort:     statEffort,
                                      base_stat:  statBase};
          }


        // --------------------------------------------------------
        // Pokemon Types
        // --------------------------------------------------------
        var pokemonTypes = response.types;
        var tempTypeArray = [];

        for(var i =0; i < pokemonTypes.length; i++) {
  
            var curType = pokemonTypes[i].type.name;

            tempTypeArray.push(curType);
          }


        // --------------------------------------------------------
        // Pokemon Object
        // --------------------------------------------------------
        pokemonMap[pokemonName] = { moves:      tempMoveArray,
                                    stats:      tempStatObj,
                                    abilities:  tempAbilityArray,
                                    gifFront:   pokemonName + ".gif",
                                    pokemonNumber: response.id, 
                                    types: tempTypeArray,
                                    name: pokemonName};

        console.log(pokemonMap);

        displayPokemon(pokemonMap[pokemonName]);

      });
}

function choosePokemon(pokemon) {
  var curPokemonMoves = pokemonMap[pokemon].moves;
  $("#moveChoices").empty();
 
  for (var i = 0; i < curPokemonMoves.length; i++ ) {

    var moveSpan = $("<span>");
    moveSpan.attr("class","label label-success pokemonMoves");
    moveSpan.text(curPokemonMoves[i].moveName);
    $("#moveChoices").append(moveSpan);
  }

  var curPokemonAbilities = pokemonMap[pokemon].abilities;
  $("#abilityChoices").empty();
 
  for (var i = 0; i < curPokemonAbilities.length; i++ ) {

    var abilitySpan = $("<span>");
    abilitySpan.attr("class","label label-success pokemonAbility");
    abilitySpan.text(curPokemonAbilities[i].abilityName);
    $("#abilityChoices").append(abilitySpan);
  }


}




function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
