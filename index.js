'use strict';

const { graphql, buildSchema } = require ('graphql');
const express = require('express');
const graphqlHTTP = require('express-graphql');



const schema = buildSchema(`
type Query {
  video: Video
  videos: [Video]
}

type Video {
  id: ID,
  title: String,
  duration: Int,
  watched: Boolean
}


type Schema {
  query: Query
}
`);

const videoA = {
  id: 'a', 
  title: 'Video A',
  duration: 120,
  watched: true,
};
const videoB = {
  id: 'b', 
  title: 'Video B',
  duration: 240, 
  watched: false,
};
const videos = [videoA, videoB];

const resolvers = {
  video: () => ({
    id: () => '1',
    title: () => 'bar',
    duration: () => 180,
    watched: () => true
  }),
  videos: () => videos


};

//begin server
const PORT = process.env.PORT || 3000;
const server = express();

server.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
    rootValue: resolvers
  })
);

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
//end server


  // graphql(schema, query, resolvers)
  // .then((result) => console.log(result))
  // .catch((error) => console.log(error))