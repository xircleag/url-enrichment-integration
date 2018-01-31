# URL Enrichment Integration

URL Enrichment Integration, built using the Layer [Integration Development Kit](https://preview-docs.layer.com/reference/integrations/framework).

## Microsoft Azure

Make sure you configure [Azure Credentials](https://serverless.com/framework/docs/providers/azure/guide/credentials/) before deploying the integration.

## Deploy

Run the following command to deploy your integration:

    layer-integrations deploy

Read more on how to access Serverless [function logs](https://serverless.com/framework/docs/providers/aws/cli-reference/logs/) so you can monitor your integration.

## Webpack

We are using webpack to bundle the packages in azure as serverless does not provide a good way to package and upload local and private npm dependencies. We need to refrence the `dist/bundle` in the `serverless.yml` file so that it is linked to the build files on azure.
