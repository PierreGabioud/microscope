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
    return [
      Meteor.subscribe('singlePost', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
  },
	data: function(){ 
		return Posts.findOne(this.params._id);
	}
});

//Editing a post route
Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  waitOn: function(){
    return Meteor.subscribe('singlePost', this.params._id);
  },
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
    return {sort: this.sort, limit: this.postsLimit()};
  },
  subscriptions: function() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function(){
    var hasMore = this.posts().count() === this.postsLimit();
    return {
      posts: this.posts(),
      ready: this.postsSub.ready,
      nextPath: hasMore ? this.nextPath() : null
    }
  }
});

NewPostsController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function(){
    return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

BestPostsController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id:1},
  nextPath: function(){
    return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

Router.route('/', {
  name: 'home',
  controller: NewPostsController
});

//This ? is to say it's not mandatory. So this route matches 
//everything and should be placed at the end
Router.route('/new/:postsLimit?', {
  name: 'newPosts'
});
Router.route('/best/:postsLimit?', {
  name: 'bestPosts'
});


Router.onBeforeAction('dataNotFound', {only: 'postPage'}); //show the notfound page not just for invalid routes but also for the postPage route, whenever the data function returns a falsy object!
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});