'use strict'

const LayerIDK = require('@layerhq/idk')
const Enrich = require('common/enrich')

const configJSON = process.env.LAYER_CONFIG ? require(process.env.LAYER_CONFIG) : require('./layer_config.json')
const layerIDK = new LayerIDK(configJSON)

/**
 * Webhook function handler
 * https://serverless.com/framework/docs/providers/aws/guide/functions/
 */
exports.webhook = (context, req) => {
  const log = layerIDK.logger(context)

  try {
    const webhook = layerIDK.webhook(req.headers, req.body)
    log.info('Webhook:', webhook.event)

    const enrich = new Enrich(layerIDK)
    enrich.message(webhook.message)
      .then(() => {
        log.info(`Webhook: OK`)
        context.res = { status: 200 }
        context.done()
      })
      .catch((err) => {
        log.error('Webhook: ', err)
        context.done(err)
      })
  } catch (err) {
    log.error('Webhook: ', err)
    context.done(err)
  }
}

/**
 * Verify webhook
 * https://docs.layer.com/reference/webhooks/rest.out#verify
 */
exports.verify = (context, req) => {
  const log = layerIDK.logger(context)
  const query = req.query

  log.info('Webhook.verify', query)
  context.res = {
    status: query ? 200 : 400,
    headers: {
      'Content-Type': 'text/plain'
    },
    isRaw: true,
    body: query ? query.verification_challenge : 'Missing `verification_challenge` URL query parameter'
  }
  context.done()
}
