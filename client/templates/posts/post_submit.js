Template.postSubmit.events({
	'submit form': function(e){
		e.preventDefault();

		var post = {
			url: $(e.target).find('[name=url]').val(),
			title: $(e.target).find('[name=title]').val()
		};

		//Errors created in posts.js
		var errors = validatePost(post);
		if(errors.title || errors.url)
			return Session.set('postSubmitErrors', errors); // We use return so that it also aborts


		Meteor.call('postInsert', post, function(error, result){
			if(error){
				return Errros.throw(error.reason);
			}

			//Show this result but route anyway because we still have the id of the existing post
			if(result.postExists){
				Errors.throw('This link has already been posted');
			}

			Router.go('postPage', {_id: result._id});

		});

		post._id = Posts.insert(post);
		Router.go('postPage', post);
	}
});



Template.postSubmit.created = function(){
	Session.set('postSubmitErrors', {});
}

Template.postSubmit.helpers({
	errorMessage: function(field){
		return Session.get('postSubmitErrors')[field];
	},
	errorClass: function(field){
		return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
	}
})