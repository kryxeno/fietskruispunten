<script>
  // Importeer afbeeldingen
  import Obstakelicon from "$lib/components/obstakel.svelte"
  import Starteindobstakel from "./starteindobstakel.svelte";

  export let route = {};
  export let totaleafstand = 10000;

  let obstacles = [
    { label: 'Stoplicht', afstand: 20, type: 'stoplicht' },
    { label: 'Fietswegen', afstand: 60, type: 'fietswegen' },
    { label: 'Kruispunten', afstand: 80, type: 'kruispunten' },
   
  ];


</script>

<div class="timeline-container">

 <div class="route-line">
    <Starteindobstakel type={"start"} afstand={0}/> 
    <Starteindobstakel type={"eind"} afstand={100}/> 
    {#each obstacles as { label, type, afstand }}
      <Obstakelicon type={type} afstand={afstand}/> 
    {/each}
    <div class="route-labels start">
      <p class="top">
        0 m
      </p>
      <p class="bottom">
        {route.start}
      </p>
    </div>
    <div class="route-labels eind">
      <p class="top">
        {totaleafstand} m / {totaleafstand * 1.5 / 1000} min 
      </p>
      <p class="botttom">
        {route.eind}
      </p>
    </div>  
  </div>

</div>



<style lang="scss">

  .route-labels{
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 3rem;

    p{
      font-size: 0.8rem;
    }

    &.eind{
      right: 0%;
      p{
      text-align: right;
      }
    }
  }
  

  .timeline-container {
    position: relative;
    margin: 0 3rem;
    height: 8rem;
    display: flex;
    align-items: center;
  }




  .route-line {
    height: 4px;
    background-color: black;
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
  }


</style>
