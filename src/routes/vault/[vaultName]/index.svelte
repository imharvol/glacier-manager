<script>
  import { client } from '../../_stores'
  import { page } from '$app/stores'
  import copy from '$lib/copy.js'

  import HideableObject from '$lib/HideableObject.svelte'

  const vaultName = $page.params.vaultName

  let vaultInfo = null
  let vaultJobs = null

  const describeVault = async () => {
    if (!$client) return console.log(`No client to list vaults`)

    const command = new window.glacier.DescribeVaultCommand({
      accountId: '-',
      vaultName: $page.params.vaultName
    })
    const response = await $client.send(command)
    return response
  }

  const listJobs = async () => {
    if (!$client) return console.log(`No client to list vaults`)

    const command = new window.glacier.ListJobsCommand({
      accountId: '-',
      vaultName: $page.params.vaultName
    })
    const response = await $client.send(command)
    return response.JobList
  }

  const startInventoryRetrieval = async () => {
    if (!$client) return console.log(`No client to list vaults`)

    const command = new window.glacier.InitiateJobCommand({
      accountId: '-',
      vaultName: $page.params.vaultName,
      jobParameters: {
        Type: 'inventory-retrieval',
        Format: 'JSON'
      }
    })
    const response = await $client.send(command)

    // Update job list with the new job
    fetchData()

    return response
  }

  const fetchData = async () => {
    if ($client) {
      vaultInfo = await describeVault()
      vaultJobs = await listJobs()
    } else {
      vaultInfo = vaultJobs = null
    }
  }
  client.subscribe(fetchData)
</script>

<head>
  <title>{$page.params.vaultName} | AWS Glacier Dashboard</title>
</head>

<main>
  <h1>{vaultName}</h1>

  <h2>Vault Details</h2>
  {#if vaultInfo}
    <div class="info-container">
      <div class="info-attribute">
        <div class="info-attribute-name flex-container">
          <img class="pointer" on:click={() => copy(vaultName)} src="/copy.svg" alt="copy" />Name:
        </div>
        <div class="info-attribute-value">{vaultName}</div>
      </div>
      <div class="info-attribute">
        <div class="info-attribute-name flex-container">
          <img
            class="pointer"
            on:click={() => copy(vaultInfo.VaultARN)}
            src="/copy.svg"
            alt="copy"
          />ARN:
        </div>
        <div class="info-attribute-value">{vaultInfo.VaultARN}</div>
      </div>
      <div class="info-attribute">
        <div class="info-attribute-name">Size:</div>
        <div class="info-attribute-value">
          {vaultInfo.SizeInBytes} bytes / ~{Math.round(vaultInfo.SizeInBytes / Math.pow(2, 20))} MB
        </div>
      </div>
      <div class="info-attribute">
        <div class="info-attribute-name">Number of archives:</div>
        <div class="info-attribute-value">{vaultInfo.NumberOfArchives}</div>
      </div>
      <div class="info-attribute">
        <div class="info-attribute-name">Creation date:</div>
        <div class="info-attribute-value">
          {new Date(vaultInfo.CreationDate).toLocaleString()}
        </div>
      </div>
    </div>

    <button on:click={startInventoryRetrieval}>Start Inventory Retrieval</button>

    <HideableObject object={vaultInfo} title="full vault details" />
  {:else}
    <span>Loading vault details ...</span>
  {/if}

  <hr />

  <h2>Vault Jobs</h2>
  {#if vaultJobs}
    {#if vaultJobs.length === 0}
      <span>This vault has no jobs</span>
    {:else}
      <div class="item-list">
        {#each vaultJobs as job}
          <div class="item">
            <div class="flex-container">
              <h3>{job.JobId.substr(0, 10) + '...' + job.JobId.substr(job.JobId.length - 10)}</h3>
              <a href="/vault/{vaultName}/job/{job.JobId}"
                ><button style="margin: 0 0 0 1rem;">View job</button></a
              >
            </div>

            <div class="info-attribute">
              <div class="info-attribute-name flex-container">
                <img
                  class="pointer"
                  on:click={() => copy(job.JobId)}
                  src="/copy.svg"
                  alt="copy"
                />Id:
              </div>
              <div class="info-attribute-value">{job.JobId}</div>
            </div>
            <div class="info-attribute">
              <div class="info-attribute-name">Type/Action:</div>
              <div class="info-attribute-value">{job.Action}</div>
            </div>
            <div class="info-attribute">
              <div class="info-attribute-name">Completed:</div>
              <div class="info-attribute-value">{job.Completed}</div>
            </div>
            <div class="info-attribute">
              <div class="info-attribute-name">Creation date:</div>
              <div class="info-attribute-value">
                {new Date(job.CreationDate).toLocaleString()}
              </div>
            </div>
            {#if job.CompletionDate}
              <div class="info-attribute">
                <div class="info-attribute-name">Completion date:</div>
                <div class="info-attribute-value">
                  {new Date(job.CreationDate).toLocaleString()}
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
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

  main > h1 {
    text-align: center;
    font-size: larger;
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
