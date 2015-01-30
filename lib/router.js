Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
  	return Meteor.subscribe('posts'); //we subscribe here for ALL routes
  }
});

Router.route('/', {name: 'postsList'});

Router.route('/posts/:_id', {
	name: 'postPage',
	data: function(){ 
		return Posts.findOne(this.params._id);
	}
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
}


Router.onBeforeAction('dataNotFound', {only: 'postPage'}); //show the notfound page not just for invalid routes but also for the postPage route, whenever the data function returns a falsy object!
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});