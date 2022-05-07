<script>
  import { client } from '../routes/_stores'
  import copy from '$lib/copy.js'

  let vaultList = null

  const listVaults = async () => {
    if (!$client) return console.log(`No client to list vaults`)

    const command = new window.glacier.ListVaultsCommand({
      accountId: '-'
    })
    const response = await $client.send(command)
    return response.VaultList
  }

  const fetchData = async () => {
    if ($client) {
      vaultList = await listVaults()
    } else {
      vaultList = null
    }
  }
  client.subscribe(fetchData) // Fetch the data when the client changes
</script>

<main>
  <h2>Vault list</h2>
  {#if vaultList}
    <div class="item-list">
      {#each vaultList as vault}
        <div class="item">
          <div class="flex-container">
            <h3>{vault.VaultName}</h3>
            <a href="/vault/{vault.VaultName}">
              <button style="margin: 0 0 0 1rem;">View vault</button>
            </a>
          </div>
          <div class="info-attribute">
            <div class="info-attribute-name flex-container">
              <img
                class="pointer"
                on:click={() => copy(vault.VaultName)}
                src="/copy.svg"
                alt="copy"
              />Name:
            </div>
            <div class="info-attribute-value">{vault.VaultName}</div>
          </div>
          <div class="info-attribute">
            <div class="info-attribute-name">Size:</div>
            <div class="info-attribute-value">
              {vault.SizeInBytes} bytes / ~{Math.round(vault.SizeInBytes / Math.pow(2, 20))}MB
            </div>
          </div>
          <div class="info-attribute">
            <div class="info-attribute-name">Number of archives:</div>
            <div class="info-attribute-value">{vault.NumberOfArchives}</div>
          </div>
          <div class="info-attribute">
            <div class="info-attribute-name">Creation date:</div>
            <div class="info-attribute-value">
              {new Date(vault.CreationDate).toLocaleString()}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <span>Fetching vault list</span>
  {/if}
</main>

<style>
  * {
    font-family: monospace;
    font-size: large;
  }

  button {
    border: 0.2rem solid #393e46;
    background-color: #eeeeee;
    cursor: pointer;
    font-size: large;
    margin: 0.5rem 0 0.5rem 0;
  }
  button:active {
    background-color: #bbbbbb;
    box-shadow: 0.1rem 0.1rem #929aab;
    transform: translateY(0.2rem);
  }

  main {
    width: 80vw;
    margin: auto;
  }

  main > h2 {
    font-size: larger;
  }

  .pointer {
    cursor: pointer;
  }

  .flex-container {
    display: flex;
    align-items: center;
  }

  .info-attribute {
    margin: 0.5rem 0 0.5rem 0;
  }
  .info-attribute-name {
    font-weight: bold;
  }
  .info-attribute-name > img {
    height: 1.2rem;
  }
  .info-attribute-value {
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 0.5rem;
    padding-left: 0.5rem;
    border-left: 0.1rem black solid;
  }

  .item {
    border-radius: 0.5rem;
    background-color: #eeeeee;
    margin: 1rem 0 1rem 0;
    padding: 0.8rem;
  }
  .item h3 {
    margin: 0;
  }
</style>
