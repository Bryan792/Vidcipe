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
  }
}; 

const realm = new Realm({schema: [PostSchema,]})

export default realm
