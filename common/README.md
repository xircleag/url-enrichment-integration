# Common

This is a local npm package which contains common functionality for this integration. It will be installed as a dependency inside the cloud provider project and can be required like any other npm module.

```javascript
const common = require('common')
```

## URL enrichment

URL enrichment is implememnted using [metascraper](https://github.com/ianstormtaylor/metascraper) to get additional metadata from a given link.
