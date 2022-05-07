<script>
  import { onMount } from 'svelte'
  import { client } from './_stores'

  import CredentialsInput from '$lib/CredentialsInput.svelte'
  import VaultList from '$lib/VaultList.svelte'
</script>

<head>
  <title>AWS Glacier Dashboard</title>
</head>

<main>
  <CredentialsInput />

  <VaultList />
</main>

<style>
</style>
