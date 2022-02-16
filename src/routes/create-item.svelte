

<article class="_content">


  <button on:click={(e)=>{e.preventDefault(); enableBrowser()}} class="_form-button"
  >Connect web3 wallet</button>

  <div class="flex justify-center">
    <div class="w-1/2 flex flex-col pb-12">
      <input
        placeholder="Asset Name"
        class="mt-8 border rounded p-4"
        bind:value={name}
      />
      <textarea
        placeholder="Asset Description"
        class="mt-2 border rounded p-4"
        bind:value={description}
      />
      <input
        placeholder="Asset Price in Eth"
        class="mt-2 border rounded p-4"
        bind:value={price}
      />
      <input
        type="file"
        name="Asset"
        class="my-4"
        bind:value={file}
        on:change={onChange}
      />
      {#if fileUrl}
        <img alt="preview" class="rounded mt-4" width="350" src={fileUrl} />
      {/if}
      {name} {price} {description}
      <button on:click="{createMarket}" class="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
        Create Digital Asset
      </button>
    </div>
  </div>

</article>







<script>
	import { onMount } from "svelte";
  import { browser } from '$app/env';

  import { defaultEvmStores, web3, selectedAccount, connected, chainId, chainData } from 'svelte-web3'
  import { goto } from '$app/navigation';
  import { create as ipfsHttpClient } from 'ipfs-http-client'

  import { ethers } from 'ethers'
  import axios from 'axios'
  import Web3Modal from "web3modal"

  import {
    nftaddress, nftmarketaddress, rpcaddress
  } from '/src/config.js'
  import NFT from '@artifacts/contracts/NFT.sol/NFT.json'
  import Market from '@artifacts/contracts/Market.sol/NFTMarket.json'

  
  export let message
  export let fileUrl, name, description, price ,file

  let client, nodeId
  // let client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

  onMount(
    async () => {
      message = 'Connecting to Ethereum Testnet Görli...'
      //  await defaultEvmStores.setProvider('https://rpc-mumbai.maticvigil.com')
       await defaultEvmStores.setProvider()
      message = ''

      const IPFSmodule = await import('/src/ipfs-core.js');
      const IPFS = IPFSmodule.default;
      console.log({ IPFS });
      const ipfsNode = await IPFS.create();
      console.log({ ipfsNode });
      // const identity = await ipfsNode.id();
      // nodeId = identity.id;
      // console.info('nodeId', nodeId);
      client = ipfsNode
  })


  


  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      fileUrl = url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }


  async function createMarket() {
    console.log('create market:', name, description, price, fileUrl)
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    const ethprice = ethers.utils.parseUnits(price, 'ether')

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(nftaddress, tokenId, ethprice, { value: listingPrice })
    await transaction.wait()
    goto('/')
  }



</script>