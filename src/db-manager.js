import Realm from 'realm'

const PostSchema = {
  name: 'Post',
  primaryKey: 'id',
  properties: {
    title: 'string',
    score: 'int',
    author: 'string',
    created: 'date',
    id: 'string',
    permalink: 'string',
    thumbnailUrl: 'string',
    thumbnailWidth: 'int',
    thumbnailHeight: 'int',
    url: 'string',
    comments: {type: 'list', objectType: 'Comment'},
    videoUrl: {type: 'string', optional: true},
    videoWidth: {type: 'int', optional: true},
    videoHeight: {type: 'int', optional: true},
  }
};

const CommentSchema = {
  name: 'Comment',
  properties: {
    body: 'string',
    author: 'string',
  }
}

const realm = new Realm({schema: 
  [
    PostSchema,
    CommentSchema,
  ]})

export default realm
