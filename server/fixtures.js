
//This is only if the database is empty
if (Posts.find().count() === 0) {
  Posts.insert({
    title: 'Introducing Telescope OMG',
    url: 'http://sachagreif.com/introducing-telescope/'
  });

  Posts.insert({
    title: 'Meteor',
    url: 'http://meteor.com'
  });

  Posts.insert({
    title: 'The Meteor Book',
    url: 'http://themeteorbook.com'
  });
}