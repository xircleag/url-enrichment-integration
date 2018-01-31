/* global it, describe */
const mochaPlugin = require('serverless-mocha-plugin')
const expect = mochaPlugin.chai.expect
const wrapped = mochaPlugin.getWrapper('webhook', '/src/handlers.js', 'webhook')
const proxyquire = require('proxyquire')

const body = require('./mock/success/event.json')
const headers = require('./mock/success/headers.json')
const errorBody = require('./mock/error/event.json')
const errorHeaders = require('./mock/error/headers.json')

const MockEnrich = class Enrich {
  message () {
    return Promise.resolve()
  }
}
const handlerProxy = proxyquire('../src/handlers', {
  'common/enrich': MockEnrich
})

describe('aws:webhook', () => {
  it('A valid body should parse the URL', (done) => {
    const eventData = {
      headers,
      body: JSON.stringify(body)
    }

    handlerProxy.webhook(eventData, {}, (err, data) => {
      expect(err).to.be.null
      expect(data.statusCode).to.be.equal(200)
      done()
    })
  })

  it('An invalid body should throw an error', () => {
    const eventData = {
      headers,
      body: ''
    }
    return wrapped.run(eventData, {})
      .catch(err => {
        const isError = err instanceof Error
        expect(isError).to.be.equal(true)
      })
  })

  it('Incorrect mime_types for url-enrichment should fail', () => {
    const eventData = {
      headers: errorHeaders,
      body: JSON.stringify(errorBody)
    }
    return wrapped.run(eventData, {})
      .catch((err) => {
        const isError = err instanceof Error
        expect(isError).to.be.equal(true)
      })
  })

  it('Invalid user-agent must fail', () => {
    const eventData = {
      headers: Object.assign({}, headers, { 'User-Agent': null }),
      body: JSON.stringify(body)
    }
    return wrapped.run(eventData, {})
      .catch(err => {
        const isError = err instanceof Error
        expect(isError).to.be.equal(true)
      })
  })

  it('Invalid event type should fail', () => {
    const INVALID_EVENT_TYPES = [
      'Message.updated',
      'Conversation.created',
      'Conversation.updated',
      'Participation.created',
      'Channel.created',
      'Channel.updated',
      'Channel.deleted',
      'Membership.created',
      'Membership.deleted'
    ]
    const promises = []
    INVALID_EVENT_TYPES.forEach(eventType => {
      const eventData = {
        headers: Object.assign({}, headers, { 'layer-webhook-event-type': eventType }),
        body: JSON.stringify(body)
      }
      promises.push(wrapped.run(eventData, {}))
    })

    return Promise.all(promises)
      .catch(err => {
        const isError = err instanceof Error
        expect(isError).to.be.equal(true)
      })
  })
})
