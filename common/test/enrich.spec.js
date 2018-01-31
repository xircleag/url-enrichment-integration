'use strict'

const Enrich = require('../enrich')

describe('Enrich.processPart', () => {
  it('should scrape URLs if valid', () => {
    const part = {
      body: JSON.stringify({
        title: "Github Home Page",
        url: "http://github.com"
      }),
      mime_type: 'application/vnd.layer.link+json'
    }

    return Enrich.processPart(part)
      .then((data) => {
        const body = JSON.parse(data.body)
        const keys = Object.keys(body)
        keys.should.eql([ 'title', 'url', 'description', 'image_url' ])
      })
  })

  it('should scrape URLs if not valid', () => {
    const part = {
      body: JSON.stringify({
        title: "incorrect url",
        url: "http://incorrect_url.com"
      }),
      mime_type: 'application/vnd.layer.link+json'
    }

    return Enrich.processPart(part)
      .then((data) => {
        should(data).be.undefined
      })
  })
})
