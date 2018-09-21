# GraphQL  Sample Server


# Build:
```$ npm install```

# Run:
```$ node index.js```

# Sample Mutation:
```
mutation AddVideoQuery($input: AddVideoInput!) {
  createVideo(input: $input) {
    video {
      title
    }
  }
}
```

# Sample Query:
```
query AllVideosQuery {
  videos {
    edges {
      node {
        title 
      }
    }
  }
}
```