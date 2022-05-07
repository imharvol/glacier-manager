<script>
  import { slide } from 'svelte/transition'

  import Object from './Object.svelte'

  export let show = false
  export let title = 'null'
  export let object = {}
</script>

<div class="container" style="width: {show ? 'auto' : 'fit-content'}">
  <button
    on:click={() => (show = !show)}
    style="border-right: {show ? null : 'none'}; border-bottom: {show ? null : 'none'};"
  >
    {show ? 'Hide' : 'Show'}
    {title}
  </button>

  {#if show}
    <div transition:slide class="object-container">
      <Object {object} />
    </div>
  {/if}
</div>

<style>
  * {
    font-family: monospace;
  }

  .container {
    border: 0.2rem solid #393e46;

    background-color: #eeeeee;
    /* width: fit-content; */
  }

  button {
    border-right: 0.2rem solid #393e46;
    border-bottom: 0.2rem solid #393e46;
    background-color: #eeeeee;
    cursor: pointer;
    font-size: large;
  }

  .object-container {
    overflow: scroll;
    margin: 0 1rem 0 1rem;
  }
</style>
