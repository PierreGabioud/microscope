Template.postItem.helpers({

	ownPost: function(){
		return this.userId === Meteor.userId();
	},

  domain: function() {
    var a = document.createElement('a');
    a.href = this.url; // Here at each iteration in post_item.html the "this" becomes the object -> here too!
    return a.hostname;
  }
});