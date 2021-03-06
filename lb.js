PlayersList = new Mongo.Collection('players');
Vote = new Mongo.Collection('vote');

if (Meteor.isClient) {
  Meteor.subscribe("thePlayers");

  Template.rating.rendered = function () {
    // at .created() time, it's too early to run rateit(), so run it at rendered()
    this.$('.rateit').rateit();
  }

Template.leaderboard.helpers({
  'player': function(){
    var currentUserId = Meteor.userId();
    return PlayersList.find({},{sort:{score:-1, name:1}});
  },
  'selectedClass': function(){
    var playerId = this._id;
    var selectedPlayer = Session.get('selectedPlayer');
    if (playerId == selectedPlayer){
      return "selected";
    }
  },
  'showSelectedPlayer': function(){
    var selectedPlayer = Session.get('selectedPlayer');
    return PlayersList.findOne(selectedPlayer);
  }
});

Template.vote.helpers({
    'vote': function(){
    return Vote.find({name:this.name});
  }
});

Template.leaderboard.events({
    'click .player': function(){
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
    },
    'click .increment': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('modifyPlayerScore', selectedPlayer, 1);
    },
    'click .decrement': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('modifyPlayerScore', selectedPlayer, -1);
    },
    'click .remove': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      if (confirm("remove player ? " + PlayersList.findOne({_id:selectedPlayer}).name)) {
        Meteor.call('removePlayerData', selectedPlayer);
      }
    }
});

Template.addPlayerForm.events({
  'submit form': function(event){
    event.preventDefault();
    var currentUserId = Meteor.userId();
    var playerNameVar = event.target.playerName.value;
    var playerScoreVar = parseInt(event.target.playerScore.value);
    Meteor.call('insertPlayerData', playerNameVar, playerScoreVar);
    event.target.playerName.value = ""
  }
});

Template.addPlayerForm.helpers({
  'showSelectedPlayer': function(){
    var selectedPlayer = Session.get('selectedPlayer');
    return PlayersList.findOne(selectedPlayer);
  }
});

Template.rating.events({
    'click .myrate': function(event, template){
      var selectedPlayer = this._id;
      var newRate = template.$('#myrate' + selectedPlayer).rateit('value');
      PlayersList.update(selectedPlayer, {$set: {score: newRate} } );
      console.log(selectedPlayer)
    }
});

}

if (Meteor.isServer) {

if ( PlayersList.find().count() === 0 ) {
  PlayersList.insert({name: "David", score: 0});
  PlayersList.insert({name: "Bob", score: 0});
  PlayersList.insert({name: "Mary", score: 0});
  PlayersList.insert({name: "Bill", score: 0});
  PlayersList.insert({name: "Warren", score: 0});
  PlayersList.insert({name: "Tim", score: 0});
}

if ( Vote.find().count() === 0 ) {
  Vote.insert({name: "David",  comment: "good"});
  Vote.insert({name: "David",  comment: "good"});
  Vote.insert({name: "Bill",   comment: "good"});
  Vote.insert({name: "Bill",   comment: "good"});
}

Meteor.publish("thePlayers", function() {
  var currentUserId = this.userId
  return PlayersList.find({createdBy:currentUserId});
});

Meteor.methods({
  'insertPlayerData': function(playerNameVar,playerScoreVar){
    var currentUserId = Meteor.userId();
    PlayersList.insert({
      name: playerNameVar,
      score: playerScoreVar,
      createdBy: currentUserId
    })
  },
  'removePlayerData': function(selectedPlayer){
    var currentUserId = Meteor.userId();
    PlayersList.remove({_id:selectedPlayer, createdBy:currentUserId});
  },
  'modifyPlayerScore': function(selectedPlayer, scoreValue){
    var currentUserId = Meteor.userId();
    PlayersList.update({_id:selectedPlayer, createdBy:currentUserId}, {$inc: {score: scoreValue} });
  }

});

}
