'use strict'

// https://github.com/ianstormtaylor/metascraper
const metascraper = require('metascraper')
const LayerIDK = require('@layerhq/idk')

const TAGS = ['title', 'description', 'image_url', 'author']

module.exports = class Enrich {
  /**
   * Enrich class constructor
   *
   * @constructor
   * @param  {Object} layerIDK LayerIDK instance
   */
  constructor (layerIDK) {
    this.api = layerIDK.api
  }

  message (message) {
    const parts = LayerIDK.filterMessageParts(message.parts, { subtype: 'vnd.layer.link' })

    const operations = parts.map((part) => Enrich.processPart(part))
    return Promise.all(operations)
      .then((parts) => {
        if (!parts || !parts.length) return Promise.resolve()
        return this._updateParts(message, parts)
      })
  }

  _updateParts (message, parts) {
    const conversationId = message.conversation.id
    const messageId = message.id

    const operations = []
    parts.forEach((part) => {
      if (!part) return

      const partId = part.id
      const partBody = {
        mime_type: part.mime_type,
        body: part.body
      }
      operations.push(this.api.messages.updatePart(conversationId, messageId, partId, partBody))
    })
    return Promise.all(operations)
  }

  static processPart (part) {
    let body = null
    try {
      body = JSON.parse(part.body)
    } catch (err) {
      return Promise.resolve()
    }

    // collect missing tags
    const tags = []
    TAGS.forEach((tag) => {
      if (!body.hasOwnProperty(tag)) tags.push(tag)
    })
    if (!tags.length) return Promise.resolve()

    return metascraper.scrapeUrl(body.url)
      .then((res) => {
        tags.forEach((tag) => {
          // update missing tags
          if (res[tag]) body[tag] = res[tag]
          if (tag === 'image_url') body[tag] = res['image']
        })

        part.body = JSON.stringify(body)
        return part
      })
      .catch(() => Promise.resolve()) // suppress errors
  }
}
