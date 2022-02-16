
<div class="_content">
  <h2 class="text-2xl font-bold">{workflow.Name}</h2>

  <div>
    {@html marked(workflow.Description ||'')}
  </div>

  {#if !bounty}
    <form
      class="new"
      method="post"
      on:submit={async (e)=>{
        handleSubmit(e)
        e.preventDefault()
        }}
    >

      <div class="mt-8 max-w-md">

        <div class="mb-4" >
          <button on:click={(e)=>{e.preventDefault(); console.log('woof'); enableBrowser()}} class="_form-button"
          >Connect web3 wallet</button>
        </div>

        <div class="mb-4" >
          <label for="requester" class="_form-label">Requester</label>
          <input
            type="text"
            id="requester"
            name="requester"
            class="_form-input"
            bind:value={requester}
          >
        </div>


        <div class="mb-4">
          <Dropzone on:drop={handleFilesSelect} multiple={false} disableDefaultStyles={true} 
            containerClasses='_form-dropzone'
            >
            Drag and Drop a .fasta file
          </Dropzone>
        </div>

        <div class="mb-4">
          <label for="name" class="_form-label">Protein Name</label>
          <input
            type="text"
            id="name"
            name="name"
            class="_form-input"
            bind:value={name}
          >
        </div>

        <div class="mb-4">
          <label for="sequence" class="_form-label">Protein Sequence</label>
          <textarea
            id="sequence"
            name="sequence"
            bind:value={sequence}
            class="_form-textarea"
            rows="18"
          ></textarea>
        </div>

        <div class="mb-4" >
          <label for="maxDate" class="_form-label">Max Template Date</label>
          <input
            type="text"
            id="maxDate"
            name="maxDate"
            class="_form-input"
            bind:value={maxDate}
          >
        </div>

        <div class="mb-4" >
          <label for="weights" class="_form-label">Weights Download URL</label>
          <input
            type="text"
            id="weights"
            name="weights"
            class="_form-input"
            bind:value={weightsUrl}
          >
        </div>

        <div class="mb-4" >
          <label for="requester" class="_form-label">Prediction Mode</label>
          <div class="form-check">
            <input checked type="radio" name="monomer" id="monomer" value={"monomer"} bind:group={mode} class="_form-radio" >
            <label class="_form-label" for="monomer">
              monomer
            </label>
          </div>
          <div class="form-check">
            <input checked type="radio" name="monomer_single" id="monomer_single" value={"monomer_single"} bind:group={mode} class="_form-radio" >
            <label class="_form-label" for="monomer_single">
              monomer_single
            </label>
          </div>
          <div class="form-check">
            <input checked type="radio" name="monomer_casp14" id="monomer_casp14" value={"monomer_casp14"} bind:group={mode} class="_form-radio" >
            <label class="_form-label" for="monomer_casp14">
              monomer_casp14
            </label>
          </div>
          <div class="form-check">
            <input checked type="radio" name="monomer_ptm" id="monomer_ptm" value={"monomer_ptm"} bind:group={mode} class="_form-radio" >
            <label class="_form-label" for="monomer_ptm">
              monomer_ptm
            </label>
          </div>
          <div class="form-check">
            <input checked type="radio" name="monomer_ptm_single" id="monomer_ptm_single" value={"monomer_ptm_single"} bind:group={mode} class="_form-radio" >
            <label class="_form-label" for="monomer_ptm_single">
              monomer_ptm_single
            </label>
          </div>
          <div class="form-check">
            <input checked type="radio" name="multimer" id="multimer" value={"multimer"} bind:group={mode} class="_form-radio" >
            <label class="_form-label" for="multimer">
              multimer
            </label>
          </div>
          <div class="form-check">
            <input checked type="radio" name="multimer_single" id="multimer_single" value={"multimer_single"} bind:group={mode} class="_form-radio" >
            <label class="_form-label" for="multimer_single">
              multimer_single
            </label>
          </div>
        </div>
        
        {#if mode && mode.includes('multimer')}
          <div class="mb-4" >
            <div class="form-check form-switch">
              <input bind:value={isProk} style="background-size: auto" class="form-check-input _form-switch" type="checkbox" role="switch" id="isProk">
              <label class="_form-label" for="isProk">Prokaryote prediction</label>
            </div>
          </div>
        {/if}

        <div class="mb-4" >
          <label for="requester" class="_form-label">Database Size</label>
          <div class="form-check">
            <input checked type="radio" name="full" id="full" value={"full"} bind:group={dbSize} class="_form-radio" >
            <label class="_form-label" for="full">
              full
            </label>
          </div>
          <div class="form-check">
            <input checked type="radio" name="reduced" id="reduced" value={"reduced"} bind:group={dbSize} class="_form-radio" >
            <label class="_form-label" for="reduced">
              reduced
            </label>
          </div>
        </div>

        <input type="submit" value="Get Alpha Fold" disabled="{isSubmitted}"
          class="p-4 mt-4 transition cursor-pointer rounded-md bg-blue-500 hover:ease-in ease-out hover:bg-blue-600 text-white disabled:bg-slate-300 disabled:cursor-not-allowed"
          >

        {#if isSubmitted}
          <span class="pl-4"><span class="_spinner"></span>Submitting bounty</span>
        {/if}

      </div>
    </form>
  {/if}

</div>



<div class="md:grid gap-4 grid-cols-2">
  <div class="code">
    <pre class="line-numbers language-json">{@html Prism.highlight(JSON.stringify(inputData,null,2), Prism.languages[language])}</pre>
  </div>

  <div class="">
    <div class="ngl overflow-auto">
      <!-- <NGL height={"347px"} pdbFile={file} /> -->
    </div>
  </div>

</div>

<!-- <NGL height={"1000px"}   /> -->







  {#if $connected}
    <p>
      Connected chain: chainId = {$chainId}
    </p>
    <p>
      chainData = {JSON.stringify($chainData)}
    </p>
    <p>
      Selected account: {$selectedAccount || 'not defined'}
    </p>

    <p>
      {checkAccount} Balance on {$chainData.name}:
      {#await balance}
        <span>waiting...</span>
      {:then value}
        <span>{value}</span>
      {/await} {$chainData.nativeCurrency.symbol}
    </p>
<!-- 
    {#if $selectedAccount}
    <p><button on:click="{sendTip}">send 0.01 {$chainData.nativeCurrency.symbol} tip to {$selectedAccount} (author)</button></p>
    {/if} -->

  {/if}



<script>
  import JSON5 from 'json5'
  import {marked} from 'marked'
  import Prism from 'prismjs';
  import Dropzone from "svelte-file-dropzone";
  import { ethers } from 'ethers'
	import { onMount } from "svelte";

  import { browser } from '$app/env';
	import NGL from '$lib/components/Ngl.svelte';






  let language = 'javascript'
  export let workflow, bounty, isSubmitted, isWaiting
  export let name="fooooodl", sequence=JSON5.parse(workflow.InputExample).input.sequence, requester='yawnxyz', mode='monomer', dbSize='full', maxDate='2022-01-01', isProk=false, proteinId
  export let weightsUrl = 'https://storage.googleapis.com/alphafold/alphafold_params_2021-10-27.tar'

  let files = {
    accepted: [],
    rejected: []
  };

  let file, fContent, fArray=[]



  let inputData
  
  $: inputData = {
    name,
    sequence,
    input: {
      weights_download_url: weightsUrl,
      mode,
      db: dbSize,
      max_template_date: maxDate,
      is_prokaryote: isProk
    }
  }

  // let highlighted = Prism.highlight(codeblock, Prism.languages.json, 'language-json')

  $: if(browser) {
    Prism.highlightAll()
  }



  $: if(file) {
    const reader = new FileReader();

  }

  function handleFilesSelect(e) {
    const { acceptedFiles, fileRejections } = e.detail;
    file = acceptedFiles[acceptedFiles.length-1]
    files.accepted = [...files.accepted, ...acceptedFiles];
    files.rejected = [...files.rejected, ...fileRejections];

    const reader = new FileReader();
    reader.addEventListener('load', function (e) {
      fContent = e.target.result;
      // console.log('::', fContent)
    });
    reader.readAsBinaryString(file)
  }

  $: if(fContent) {
    // break into array; read line by line;
    // all fasta fiels look like: >YP_004421602.1 hypothetical protein; putative tail fibre [Campylobacter phage NCTC12673] on first line
    fArray = fContent.split('\n')
    // console.log('::::', fArray)

    if(fArray[0][0] == '>') {// check if fasta
      name = fArray[0].match(/\[(.*)\]/)[1]
      proteinId = fArray[0].match(/^([\S]+)/)[0].substr(1)
      fArray.shift() // remove first 
      sequence = fArray.join('')

      // console.log('???',name, '???', protId, sequence)
    }
  }


  async function createBounty() {
    console.log('Creating Bounty')

    // post new submission to board
    const bountyRes = await fetch(
      `https://openlab-yawnxyz.vercel.app/api/v0/bounties/create`, 
      {
        headers: {'Content-Type': 'application/json',},
        method: 'POST',
        body: JSON.stringify({
          Requester: requester,
          Input: inputData,
          Workflows: workflow['Name'],
        })
      })

    if(bountyRes.ok) {
      bounty = await bountyRes.json()
      console.log('Bounty created:', bounty)
    }

    return true
  }







  async function pingEndpoint() {
    console.log('Pinging Endpoint:', workflow.Endpoint, bounty)
    // ping the endpoint to start doing async work, if it exists, w/ a GET request
    if(workflow.Endpoint) {
      const pingRes = await fetch(`${workflow.Endpoint}?bountyId=${bounty.id}`)
    }

    return true
  }


  async function handleSubmit(e) {
    try {

      isSubmitted = true
      isWaiting = true

      await createBounty()
      try {
        await pingEndpoint()

        // instead of displaying the bounty here, route to a permanent bounty page
        goto(`/bounties/${bounty.id}`)
      } catch(e) {}

      // checkSubmission()
      // checkForSubmissions(bounty.id, Submissions)

    } catch(err) {
      console.error('Request error:', err)
    }
  }











  import { defaultEvmStores, web3, selectedAccount, connected, chainId, chainData } from 'svelte-web3'
  export let message
  export let tipAddress
  const enableBrowser = () => defaultEvmStores.setBrowserProvider('https://rpc-mumbai.maticvigil.com')
  $: checkAccount = $selectedAccount || '0x0000000000000000000000000000000000000000'
  $: requester = $selectedAccount
  $: balance = $connected ? $web3.eth.getBalance(checkAccount) : ''
  const sendTip = async (e) => {
    console.log('Received move event (sendTip button)', e)
    const tx = await $web3.eth.sendTransaction({
      // gasPrice: $web3.utils.toHex($web3.utils.toWei('30', 'gwei')),
      gasLimit: $web3.utils.toHex('21000'),
      from: $selectedAccount,
      to: $selectedAccount,
      value: $web3.utils.toHex($web3.utils.toWei('1', 'finney'))
    })
    console.log('Receipt from sendTip transaction', tx)
    alert('Thanks!')
  }
  onMount(
    async () => {
      message = 'Connecting to Ethereum Testnet Görli...'
       await defaultEvmStores.setProvider('https://rpc-mumbai.maticvigil.com')
      message = ''
  })

</script>