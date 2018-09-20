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
const { 
  nodeDefinitions,
  fromGlobalId,
  globalIdField,
  connectionDefinitions,
  connectionFromPromisedArray,
  connectionArgs
 } = require('graphql-relay');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { createVideo, getVideoById, getVideos, getObjectById } = require('./src/data');




// Nodes interface type
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    return getObjectById(type.toLowerCase(), id);
  },
  (object) => {
    if (object.title) {
      return videoType;
    }

    return null;
  }
);

// video type
const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'A video',
  fields: {
    id: globalIdField(),
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

const { connectionType: VideoConnection } = connectionDefinitions({
  nodeType: videoType,
  connectionFields: () => ({
    totalCount: {
      type: GraphQLInt,
      description: "Count of total number of objects",
      resolve: (conn) => {
        return conn.edges.length;
      }
    }
  })
})

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
    node: nodeField,
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
      type: VideoConnection,
      args: connectionArgs,
      resolve: (_, args) => connectionFromPromisedArray(
        getVideos(),
        args,
      ) 
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