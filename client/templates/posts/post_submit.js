Template.postSubmit.events({
	'submit form': function(e){
		e.preventDefault();

		var post = {
			url: $(e.target).find('[name=url]').val(),
			title: $(e.target).find('[name=title]').val()
		};


		Meteor.call('postInsert', post, function(error, result){
			if(error){
				return alert(error.reason);
			}

			//Show this result but route anyway because we still have the id of the existing post
			if(result.postExists){
				alert('This link has already been posted');
			}

			Router.go('postPage', {_id: result._id});

		});

		post._id = Posts.insert(post);
		Router.go('postPage', post);
	}
});