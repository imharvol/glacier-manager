<script>
  import HideableObject from '$lib/HideableObject.svelte'
  import { client } from '../../../../_stores'
  import { page } from '$app/stores'
  import copy from '$lib/copy.js'

  const jobId = $page.params.jobId
  const vaultName = $page.params.vaultName

  const utf8Decoder = new TextDecoder('utf-8')

  let jobInfo = null
  let jobOutput = null

  const describeJob = async () => {
    if (!$client) return console.log(`No client`)

    const command = new window.glacier.DescribeJobCommand({
      accountId: '-',
      vaultName: $page.params.vaultName,
      jobId: $page.params.jobId
    })
    const response = await $client.send(command)
    return response
  }

  const getJobOutput = async () => {
    if (!$client) return console.log(`No client`)

    const command = new window.glacier.GetJobOutputCommand({
      accountId: '-',
      vaultName: $page.params.vaultName,
      jobId: $page.params.jobId
    })
    const response = await $client.send(command)

    // Parse the body if possible
    if (response.contentType === 'application/json') {
      const jobOutputBodyValue = utf8Decoder.decode((await response.body.getReader().read()).value)
      response.body = JSON.parse(jobOutputBodyValue)
    } else if (response.contentType === 'text/csv') {
      const jobOutputBodyValue = utf8Decoder.decode((await response.body.getReader().read()).value)
      response.body = jobOutputBodyValue
    }

    return response
  }

  const fetchData = async () => {
    if ($client) {
      jobInfo = await describeJob()
      if (jobInfo.Action === 'InventoryRetrieval' && jobInfo.Completed) {
        try {
          jobOutput = await getJobOutput()
        } catch (err) {
          // This might happen is the job was completed 24h+ hours ago
          console.log(err) // TODO: Show the error message to the user
        }
      }
    } else {
      jobInfo = jobOutput = null
    }
  }
  client.subscribe(fetchData)
</script>

<head>
  <title>Job {$page.params.jobId.substr(0, 8)}... | AWS Glacier Dashboard</title>
</head>

<main>
  <h1>
    <a href="/vault/{vaultName}">{vaultName}</a> -
    {jobId.substr(0, 10) + '...' + jobId.substr(jobId.length - 10)}
  </h1>

  <h2>Job Details</h2>
  {#if jobInfo}
    <div class="info-container">
      <div class="info-attribute">
        <div class="info-attribute-name flex-container">
          <img class="pointer" on:click={() => copy(jobId)} src="/copy.svg" alt="copy" />Id:
        </div>
        <div class="info-attribute-value">{jobInfo.JobId}</div>
      </div>
      <div class="info-attribute">
        <div class="info-attribute-name">Description:</div>
        <div class="info-attribute-value">{jobInfo.JobDescription}</div>
      </div>
      <div class="info-attribute">
        <div class="info-attribute-name">Type:</div>
        <div class="info-attribute-value">{jobInfo.Action}</div>
      </div>
      <div class="info-attribute">
        <div class="info-attribute-name">Completed:</div>
        <div class="info-attribute-value">{jobInfo.Completed}</div>
      </div>
      <div class="info-attribute">
        <div class="info-attribute-name">Creation date:</div>
        <div class="info-attribute-value">
          {new Date(jobInfo.CreationDate).toLocaleString()}
        </div>
      </div>
      {#if jobInfo.Completed}
        <div class="info-attribute">
          <div class="info-attribute-name">Completion date:</div>
          <div class="info-attribute-value">
            {new Date(jobInfo.CompletionDate).toLocaleString()}
          </div>
        </div>
      {/if}
    </div>

    <HideableObject object={jobInfo} title="full job details" />
  {:else}
    <span>Loading job details ...</span>
  {/if}

  <hr />

  <h2>Job Output</h2>
  {#if jobInfo}
    {#if jobInfo.Action !== 'InventoryRetrieval'}
      <span>
        Unsuported job type: {jobInfo.Action}. The only type supported is InventoryRetrieval.
      </span>
    {:else if !jobInfo.Completed}
      <span>The job isn't completed yet. Check back later!</span>
    {:else if jobOutput}
      <HideableObject object={jobOutput} title="full job output" />
    {:else}
      <span>Loading job output ...</span>
    {/if}
  {:else}
    <span>Loading job details ...</span>
  {/if}
</main>

<style>
  * {
    font-family: monospace;
    font-size: large;
  }

  main {
    width: 80vw;
    margin: auto;
  }

  main > h1 {
    text-align: center;
    font-size: larger;
  }
  main > h1 > a {
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
</style>
