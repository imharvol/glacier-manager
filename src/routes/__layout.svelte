<script>
  import { onMount } from 'svelte'
  import loadClient from '$lib/loadClient'

  onMount(async () => {
    loadClient()
  })
</script>

<div class="header">
  <a href="/"><h1>Manager for AWS Glacier</h1></a>
</div>

<slot />

<style>
  * {
    font-family: monospace;
  }

  h1 {
    margin: 0;
  }

  a {
    text-decoration: none;
    color: #f7f7f7;
  }

  .header {
    background-color: #393e46;
    color: #f7f7f7;
    padding: 1em;
    text-align: center;
  }
</style>
