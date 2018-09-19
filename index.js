'use strict';

const { 
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList
} = require ('graphql');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { getVideoById, getVideos } = require('./src/data');

// video type
const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'A video',
  fields: {
    id: {
      type: GraphQLID,
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

// schema
const schema = new GraphQLSchema({
  query: queryType
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
//end server