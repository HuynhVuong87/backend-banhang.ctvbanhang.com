// export AWS_ACCESS_KEY_ID="AKIA2ITK3RH2VQG7CISF"
// export AWS_SECRET_ACCESS_KEY="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"
// tslint:disable-next-line: no-var-requires
const elasticsearch = require("@elastic/elasticsearch");

// tslint:disable-next-line: no-var-requires
const { AmazonConnection } = require("aws-elasticsearch-connector");

const client = new elasticsearch.Client({
  Connection: AmazonConnection,
  awsConfig: {
    credentials: {
      accessKeyId: "AKIA2ITK3RH2VQG7CISF",
      secretAccessKey: "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"
      //   sessionToken: "baz" // optional
    }
  },
  node:
    "https://search-gomdon-p7mv6xto3egdnnxyz6vs4xvr44.ap-southeast-1.es.amazonaws.com/",
});

async function run() {
  // // Let's start by indexing some data
  // await client.index({
  //   index: 'game-of-thrones',
  //   // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
  //   body: {
  //     character: 'Ned Stark',
  //     quote: 'Winter is coming.'
  //   }
  // })

  // await client.index({
  //   index: 'game-of-thrones',
  //   // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
  //   body: {
  //     character: 'Daenerys Targaryen',
  //     quote: 'I am the blood of the dragon.'
  //   }
  // })

  // await client.index({
  //   index: 'game-of-thrones',
  //   // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
  //   body: {
  //     character: 'Tyrion Lannister',
  //     quote: 'A mind needs books like a sword needs a whetstone.'
  //   }
  // })

  // // here we are forcing an index refresh, otherwise we will not
  // // get any result in the consequent search
  // await client.indices.refresh({ index: 'game-of-thrones' })

  // Let's search!
  const { body } = await client.search({
    body: {
      query: {
        ids: { values: ["wF4Nnm4BCf02uvPWM7hT", "wl4Nnm4BCf02uvPWNLir"] }
      }
    },
    index: "game-of-thrones",
    // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
  });

  console.log(body.hits.hits);
}

run().catch(console.log);
