'use strict';

const { 
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLInterfaceType
} = require ('graphql');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { createVideo, getVideoById, getVideos } = require('./src/data');

// interface type
const nodeInterface = new GraphQLInterfaceType({
  name: 'Node',
  fields:  {
      id: {
          type: new GraphQLNonNull(GraphQLID)
      }
  },
  resolveType: (object) => {
      if (object.title) {
          return videoType;
      }

      return null;
  }
});


// video type
const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'A video',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The id of the video.'
    },  
    title: {
      type: GraphQLString,
      description: 'The title of the video.',
    },
    duration: {
      type: GraphQLInt,
      description: 'The duration of the video (in seconds).',
    },
    watched: {
      type: GraphQLBoolean,
      description: 'Whether or not the viewer has watched the video.'
    }
  },
  interfaces: [nodeInterface]
});

// input type
const videoInputType = new GraphQLInputObjectType({
  name: 'VideoInput',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The title of the video.',
    },
    duration: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The duration of the video (in seconds).',
    },
    watched: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether or not the video is watched.',
    }
  }
});

// query type
const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'the root query type',
  fields: {
    video: {
      type: videoType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'the id of the video'
        }
      },
      resolve: (_, args) => {
        return getVideoById(args.id);
      }
    },
    videos: {
      type: new GraphQLList(videoType),
      resolve: getVideos, // implicit function call 
    }
  }
});

//mutation type
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The root Mutation type.',
  fields: {
    createVideo: {
      type: videoType,
      args: {
        video: {
          type: new GraphQLNonNull(videoInputType)
        },
      },
      resolve: (_, args) => {
        return createVideo(args.video);
      }
    }
  }
});

// schema
const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

//begin server
const PORT = process.env.PORT || 3000;
const server = express();

server.use('/graphql', graphqlHTTP({ // middleware config obj on mounted endpoint
    schema,
    graphiql: true
  })
);

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
//end serveroks