

<article class="_content">


  <button on:click={(e)=>{e.preventDefault(); enableBrowser()}} class="_form-button"
  >Connect web3 wallet</button>

  {#if loadingState === 'loaded' && !nfts.length}
    <h1 class="px-20 py-10 text-3xl">No assets created</h1>
  {:else}
    {#if nfts && nfts.length > 0}
      <div class="p-4">
        <h2 class="text-2xl py-2">Items Created</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {#each nfts as nft, i}
            <div key={i} class="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} class="rounded" />
              <div class="p-4 bg-black">
                <p class="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
              </div>
            </div>
          {/each}
        </div>
        {#if soldItems.length}
          <h2 class="mt-8 text-2xl py-2">Items sold</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {#each soldItems as nft, i}
              <div key={i} class="border shadow rounded-xl overflow-hidden">
                <img alt="sold img" src={nft.image} class="rounded" />
                <div class="p-4 bg-black">
                  <p class="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  {/if}

</article>






<script>
	import { onMount } from "svelte";
  import { browser } from '$app/env';

  import { defaultEvmStores, web3, selectedAccount, connected, chainId, chainData } from 'svelte-web3'
  
  import { ethers } from 'ethers'
  import axios from 'axios'
  import Web3Modal from "web3modal"

  import {
    nftaddress, nftmarketaddress, rpcaddress
  } from '/src/config.js'
  import NFT from '@artifacts/contracts/NFT.sol/NFT.json'
  import Market from '@artifacts/contracts/Market.sol/NFTMarket.json'

  
  export let message
  export let tipAddress
  export let nfts, loadingState = 'not-loaded', soldItems

  onMount(
    async () => {
      message = 'Connecting to Ethereum Testnet Görli...'
       await defaultEvmStores.setProvider('https://rpc-mumbai.maticvigil.com')
      //  await defaultEvmStores.setProvider()
      message = ''

      loadNFTs()
  })


  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchItemsCreated()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
      }
      return item
    }))
    /* create a filtered array of items that have been sold */
    soldItems = items.filter(i => i.sold)
    nfts = items
    loadingState = 'loaded'
  }
  


</script>