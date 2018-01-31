# URL Enrichment Integration
[![Build Status](https://circleci.com/gh/layerhq/url-enrichment-integration.png?circle-token=a15dd37d0140f632812859a177ad02531374491a)](https://circleci.com/gh/layerhq/url-enrichment-integration)

URL Enrichment Integration, built using the Layer [Integration Development Kit](https://preview-docs.layer.com/reference/integrations/framework). This integration is to enrich an URL posted on Layer chat by providing metadata of that website. The metadata can include title, description and image URL which can be obtained by parsing the meta/openGraph tags of that website.

## Prerequisites

[Serverless](https://serverless.com) toolkit and [layer-integrations](https://github.com/layerhq/layer-integrations) command line tool.

    sudo npm install -g serverless layer-integrations

## Cloud Providers

This integration can be deployed one of the following cloud providers:

- [Amazon AWS](./aws)
- [Microsoft Azure](./azure)
