import { region, accessKeyId, secretAccessKey, client } from '../routes/_stores'

// Try to retrieve the credentials from the browser's local storage
export default () => {
  const lsRegion = window.localStorage.getItem('region') || null
  const lsAccessKeyId = window.localStorage.getItem('accessKeyId') || null
  const lsSecretAccessKey = window.localStorage.getItem('secretAccessKey') || null

  region.set(lsRegion)
  accessKeyId.set(lsAccessKeyId)
  secretAccessKey.set(lsSecretAccessKey)

  if (lsRegion && lsAccessKeyId && lsSecretAccessKey)
    client.set(
      new window.glacier.GlacierClient({
        region: lsRegion,
        credentials: {
          accessKeyId: lsAccessKeyId,
          secretAccessKey: lsSecretAccessKey
        }
      })
    )
}
