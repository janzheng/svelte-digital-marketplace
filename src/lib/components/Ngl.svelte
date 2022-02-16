
<svelte:window use:wheel={{scrollable}} />


<!-- <svelte:window bind:scrollY={y}/> -->

<div class="" id="viewport" style="width:{width}; height:{height};" 
  on:mouseover={handleMouseOver} on:focus={handleMouseOver} on:mouseout={handleMouseOut} on:blur={handleMouseOut}
/>

<script>
	import { browser } from '$app/env';
	import { onMount } from "svelte";

  export let bgColor = 'white', width = '100%', height = '800px', pdbFile="/gp47_relaxed.pdb", pdbStr
  let stage, ngl // , y




  onMount(async() => {
    if (browser) {
      ngl = (await import('ngl'))
      console.log('[NGL Loaded]', ngl)
      stage = new ngl.Stage("viewport") // reset stag
      setStage()
    }
  })

  function setStage() {
    if(ngl) {
      // stage.loadFile("/gp47_relaxed.pdb");
  
      // stage.loadFile("/gp47_relaxed.pdb").then(function (o) {
      //   o.addRepresentation("cartoon");
      //   var duration = 1000;  // optional duration for animation, defaults to zero
      //   o.autoView(duration);  // focus on the whole structure
      // });
      
      stage.removeAllComponents()
      stage.setParameters({backgroundColor: bgColor, clipFar: 1000})
      // stage.setSpin(true)
      // stage.setRock(true)

      console.log('[NGL File]', pdbFile, typeof(pdbFile))
      if(pdbStr) { // paste the pdb content as string, turn into blob and render
        const stringBlob = new Blob( [ pdbStr ], { type: 'text/plain'} );
        console.log('loading blob:', stringBlob)
        stage.loadFile( stringBlob, { ext: "pdb", defaultRepresentation: true } );
        // stage.loadFile(pdbFile, {defaultRepresentation: true});
      } else if (typeof(pdbFile) == 'Object') {
        // handle as file
        stage.loadFile(pdbFile);
      } else {
        // handle as string (e.g. default demo)
        stage.loadFile(pdbFile, {defaultRepresentation: true});
      }
      console.log('[NGL Stage]', stage)
    }
  }

  $: if(pdbFile) {
    console.log('')
    setStage()
  }





  // prevent scrolling when using wheel + hovering over Canvas
	let scrollable = true
  function handleMouseOver(e) {
    scrollable = false
  }
  function handleMouseOut(e) {
    scrollable = true
  }

  const wheel = (node, options) => {
		let { scrollable } = options;
		const handler = e => {if (!scrollable) e.preventDefault();};
		node.addEventListener('wheel', handler, { passive: false });
		
		return {
			update(options) {
				scrollable = options.scrollable;
			},
			destroy() {
				node.removeEventListener('wheel', handler, { passive: false });
			}
		}
  }
</script>