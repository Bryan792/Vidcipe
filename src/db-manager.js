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
    backupThumbnailUrl: 'string',
    url: 'string',
    comments: { type: 'list', objectType: 'Comment' },
    videoUrl: { type: 'string', optional: true },
    videoWidth: { type: 'int', optional: true },
    videoHeight: { type: 'int', optional: true },

    // v1
    favorite: { type: 'bool', optional: true },
  },
}

const CommentSchema = {
  name: 'Comment',
  properties: {
    body: 'string',
    author: 'string',
  },
}

const realm = new Realm({ schema:
[
  PostSchema,
  CommentSchema,
],
  schemaVersion: 1,
  // TODO FIXME
  migration: (_oldRealm, newRealm) => {
    newRealm.deleteAll()
  },
})

export default realm
