

<article class="_content">


  <button on:click={(e)=>{e.preventDefault(); enableBrowser()}} class="_form-button"
  >Connect web3 wallet</button>
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

    {#if $selectedAccount}
      <p>
        {checkAccount} Balance on {$chainData.name}:
        {#await balance}
          <span>waiting...</span>
        {:then value}
          <span>{value} || {$web3.utils.fromWei(value)} </span>
        {/await} {$chainData.nativeCurrency.symbol}
      </p>
      {#if $selectedAccount}
        <p><button on:click="{sendTip}">send 0.01 {$chainData.nativeCurrency.symbol} tip to {$selectedAccount} (author)</button></p>
      {/if}
    {/if}

  {/if}





  {#if loadingState === 'loaded' && !nfts.length}
    <h1 class="px-20 py-10 text-3xl">No items in marketplace</h1>
  {:else}
    {#if nfts && nfts.length > 0}
      <div class="flex justify-center">
        <div class="px-4" style={{ maxWidth: '1600px' }}>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {#each nfts as nft, i}
              <div key={i} class="border shadow rounded-xl overflow-hidden">
                <img alt="nft image" src={nft.image} />
                <div class="p-4">
                  <p style={{ height: '64px' }} class="text-2xl font-semibold">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p class="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div class="p-4 bg-black">
                  <p class="text-2xl mb-4 font-bold text-white">{nft.price} ETH</p>
                  <button class="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            {/each}
          </div>
        </div>
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
  export let nfts, loadingState = 'not-loaded'

  onMount(
    async () => {
      message = 'Connecting to Ethereum Testnet Görli...'
      //  await defaultEvmStores.setProvider('https://rpc-mumbai.maticvigil.com')
       await defaultEvmStores.setProvider('')
      message = ''

      loadNFTs()
  })

  const enableBrowser = () => defaultEvmStores.setBrowserProvider('')
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





  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    // const provider = new ethers.providers.JsonRpcProvider() // local
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/tfr76O3icO2-U-yGwpk4qsjRH1zwKVYW")
    // const provider = new ethers.providers.JsonRpcProvider("https://rpc-mainnet.maticvigil.com/v1/ae56aec4991688b675fc5833fca07ff22ade6aa4")

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    
    console.log('----?', marketContract, provider)
    const data = await marketContract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        itemId: i.itemId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    nfts = items
    loadingState = 'loaded'
  }


  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nftaddress, nft.itemId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }




</script>