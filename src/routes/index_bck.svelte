
<script context="module">
	import { enhance } from '$lib/form';

	export const load = async ({ params, fetch }) => {
    // let paths = url.pathname.split('/')
    // const slug = paths[paths.length-1]
		// const res = await fetch(`/api/v0/workflows/${slug}`);
    const responses = [
      await fetch(`https://openlab-yawnxyz.vercel.app/api/v0/workflows/${'alphafodl'}`),
      await fetch(`https://openlab-yawnxyz.vercel.app/api/v0/submissions?workflow=${'alphafodl'}`),
      await fetch(`https://openlab-yawnxyz.vercel.app/api/v0/bounties`),
      ]

    let workflow, submissions, bounties
    let getters = await Promise.all(responses)

    if(getters[0] && getters[0].ok)
      workflow = await getters[0].json();

    if(getters[1] && getters[1].ok)
      submissions = await getters[1].json()

    if(getters[2] && getters[2].ok)
      bounties = await getters[2].json()

    return {
      props: { 
        workflow, submissions, bounties,
        workflowSlug: 'alphafodl',
      }
    }

	};

</script>


<article class="_content">

  <div class="mt-16 sm:mt-24">
    <Demo {workflow} {workflowSlug} />
  </div>


  <!-- <p>
    <a href="https://arye.substack.com/p/building-a-labdao-for-web3-biotech" target="_blank"><strong class="all-links">Building a labDAO&nbsp;for web3 biotech</strong></a>  
  </p>
  <p class="font-mono">
    <a href="https://niklasrindtorff.substack.com/p/building-a-knowledge-graph-for-biological" target="_blank"><strong class="all-links">Building a knowledge graph for biological experiments</strong></a><br>‍<br>Welcome to LabDAO. Learn more about our <a href="/about"><strong class="all-links">vision</strong></a>.<br>‍<br>
  </p> -->

</article>


<script>
	import Demo from '@lib/components/NglDemo.svelte';

  export let workflowSlug, workflow, submissions, bounties
</script>