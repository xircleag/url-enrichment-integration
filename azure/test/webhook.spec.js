/* global it, describe */
const mochaPlugin = require('serverless-mocha-plugin')
const proxyquire = require('proxyquire')

const expect = mochaPlugin.chai.expect
const wrapped = mochaPlugin.getWrapper('webhook', '/src/handlers.js', 'webhook')

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

describe('azure:webhook', () => {
  it('A valid body should parse the URL', (done) => {
    const eventData = {
      headers,
      body: JSON.stringify(body)
    }
    const context = {
      res: {},
      done: (err, response) => {
        expect(err).to.be.undefined
        const res = context.res
        expect(res.status).to.be.equal(200)
        done()
      }
    }

    handlerProxy.webhook(context, eventData)
  })

  it('An invalid body should throw an error', (done) => {
    const eventData = {
      headers,
      body: ''
    }
    const context = {
      res: {},
      done: (err, response) => {
        const isError = err instanceof Error
        expect(isError).to.be.equal(true)
        done()
      }
    }

    handlerProxy.webhook(context, eventData)
  })

  it('Incorrect mime_types for url-enrichment should fail', (done) => {
    const eventData = {
      headers: errorHeaders,
      body: JSON.stringify(errorBody)
    }
    const context = {
      res: {},
      done: (err, response) => {
        const isError = err instanceof Error
        expect(isError).to.be.equal(true)
        done()
      }
    }

    handlerProxy.webhook(context, eventData)
  })

  it('Invalid user-agent must fail', (done) => {
    const eventData = {
      headers: Object.assign({}, headers, { 'User-Agent': null }),
      body: JSON.stringify(body)
    }
    const context = {
      res: {},
      done: (err, response) => {
        const isError = err instanceof Error
        expect(isError).to.be.equal(true)
        done()
      }
    }

    handlerProxy.webhook(context, eventData)
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
