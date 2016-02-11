console.log("Hello Charlie !");

PlayersList = new Mongo.Collection('players');

if (Meteor.isServer) {

if ( PlayersList.find().count() === 0 ) {
  PlayersList.insert({name: "David", score: 0});
  PlayersList.insert({name: "Bob", score: 0});
  PlayersList.insert({name: "Mary", score: 0});
  PlayersList.insert({name: "Bill", score: 0});
  PlayersList.insert({name: "Warren", score: 0});
  PlayersList.insert({name: "Tim", score: 0});
}

}

console.log("Row count is : " + PlayersList.find().count());