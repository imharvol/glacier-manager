<script>
  import { accessKeyId, secretAccessKey, region, client } from '../routes/_stores'

  let inputRegion = ''
  let inputAccessKeyId = ''
  let inputSecretAccessKey = ''
  let inputSaveInLocalStorage = false

  $: {
    inputRegion = $region
    inputAccessKeyId = $accessKeyId
    inputSecretAccessKey = $secretAccessKey
  }

  $: disableSetCredentials =
    inputRegion === $region ||
    inputAccessKeyId === $accessKeyId ||
    inputSecretAccessKey === $secretAccessKey

  const setCredentials = async (event) => {
    event.preventDefault()

    region.set(inputRegion)
    accessKeyId.set(inputAccessKeyId)
    secretAccessKey.set(inputSecretAccessKey)
    client.set(
      new window.glacier.GlacierClient({
        region: $region,
        credentials: {
          accessKeyId: $accessKeyId,
          secretAccessKey: $secretAccessKey
        }
      })
    )

    if (inputSaveInLocalStorage) {
      window.localStorage.setItem('region', $region)
      window.localStorage.setItem('accessKeyId', $accessKeyId)
      window.localStorage.setItem('secretAccessKey', $secretAccessKey)
    }
  }

  const deleteCredentials = (event) => {
    event.preventDefault()

    // Remove credentials from local storage
    window.localStorage.removeItem('region')
    window.localStorage.removeItem('accessKeyId')
    window.localStorage.removeItem('secretAccessKey')

    // Remove credentials from stores
    region.set(null)
    accessKeyId.set(null)
    secretAccessKey.set(null)
    client.set(null)
  }
</script>

<div class="credentials-manager">
  <div class="credentials-input-box">
    <input type="text" placeholder="Region" bind:value={inputRegion} />
  </div>

  <div class="credentials-input-box">
    <input type="text" placeholder="Access Key Id" bind:value={inputAccessKeyId} />
  </div>

  <div class="credentials-input-box">
    <input type="password" placeholder="Secret Access Key" bind:value={inputSecretAccessKey} />
  </div>

  <div class="credentials-input-box">
    <label for="input-remember">Save in local storage:</label>
    <input type="checkbox" id="input-remember" bind:checked={inputSaveInLocalStorage} />
  </div>

  <button on:click={setCredentials} disabled={disableSetCredentials}>Set credentials</button>

  <button on:click={deleteCredentials}>Delete credentials</button>
</div>

<style>
  * {
    font-family: monospace;
  }

  .credentials-manager {
    width: 85vw;
    margin: auto;
    background-color: #eeeeee;
    font-size: x-large;
    text-align: center;
    margin-top: 5vh;
    margin-bottom: 5vh;
    border-radius: 1rem;
    padding: 1em;
  }
  @media (min-width: 1200px) {
    .credentials-manager {
      width: 50vw;
    }
  }

  .credentials-input-box {
    margin: 0.5em;
  }

  .credentials-input-box > input {
    font-size: x-large;
    max-width: 100%;
  }

  .credentials-manager > button {
    font-size: x-large;
    max-width: 100%;
  }
</style>
