import { browser } from '$app/env'
import { writable } from 'svelte/store'

let regionValue = null
let accessKeyIdValue = null
let secretAccessKeyValue = null
let clientValue = null
if (browser) {
  regionValue = localStorage?.getItem('region') ?? null
  accessKeyIdValue = localStorage?.getItem('accessKeyId') ?? null
  secretAccessKeyValue = localStorage?.getItem('secretAccessKey') ?? null

  if (window && regionValue && accessKeyIdValue && secretAccessKeyValue) {
    clientValue = new window.glacier.GlacierClient({
      region: regionValue,
      credentials: {
        accessKeyId: accessKeyIdValue,
        secretAccessKey: secretAccessKeyValue
      }
    })
  }
}

export const region = writable(regionValue)
export const accessKeyId = writable(accessKeyIdValue)
export const secretAccessKey = writable(secretAccessKeyValue)
export const client = writable(clientValue)
