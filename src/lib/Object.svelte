<script>
  import copy from './copy'

  export let object
</script>

<div class="container">
  {#each Object.entries(object) as entry}
    <div class="entry">
      <div class="key flex-container">
        {#if entry[1] != null && typeof entry[1] !== 'object'}
          <img class="pointer" on:click={() => copy(entry[1])} src="/copy.svg" alt="copy" />
        {/if}
        {entry[0]}
      </div>
      <div class="value">
        {#if typeof entry[1] === 'object'}
          <svelte:self object={entry[1]} />
        {:else}
          {entry[1]}
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  * {
    font-family: monospace;
  }

  .pointer {
    cursor: pointer;
  }

  .flex-container {
    display: flex;
    align-items: center;
  }

  .container {
    font-size: large;
  }

  .entry {
    margin: 0.5rem 0 0.5rem 0;
  }

  .key {
    font-weight: bold;
  }

  .key > img {
    height: 1.2rem;
  }

  .value {
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 0.5rem;
    border-left: 0.1rem black solid;
    padding-left: 0.5rem;
  }
</style>
