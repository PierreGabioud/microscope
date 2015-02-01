Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
  	return [Meteor.subscribe('notifications')]; //we subscribe here for ALL routes
  }
});



//See a post route
Router.route('/posts/:_id', {
	name: 'postPage',
  waitOn: function(){
    return Meteor.subscribe('comments', this.params._id);
  },
	data: function(){ 
		return Posts.findOne(this.params._id);
	}
});

//Editing a post route
Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  data: function() { return Posts.findOne(this.params._id)}
});


Router.route('/submit', {name: 'postSubmit'});

//Function used in onBeforeAction under
var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
};



//A router controller to avoid repetitions
PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5, 
  postsLimit: function() { 
    return parseInt(this.params.postsLimit) || this.increment; 
  },
  findOptions: function() {
    return {sort: {submitted: -1}, limit: this.postsLimit()};
  },
  waitOn: function() {
    return Meteor.subscribe('posts', this.findOptions());
  },
  data: function() {
    return {posts: Posts.find({}, this.findOptions())};
  }
});




//This ? is to say it's not mandatory. So this route matches 
//everything and should be placed at the end
Router.route('/:postsLimit?', {
  name: 'postsList'
});


Router.onBeforeAction('dataNotFound', {only: 'postPage'}); //show the notfound page not just for invalid routes but also for the postPage route, whenever the data function returns a falsy object!
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});