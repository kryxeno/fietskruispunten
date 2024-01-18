<script>
    // import startpunt from '$lib/images/startpunt.png';
    // import eindpunt from '$lib/images/eindpunt.png';
    import stoplicht from '$lib/images/stoplicht.svg';
    import fietswegen from '$lib/images/fietswegen.svg';
    import kruispunten from '$lib/images/kruispunten.svg';

    export let type = "stoplicht"
    export let afstand = 0

    const icons = {
        "stoplicht":stoplicht, 
        "fietswegen": fietswegen,
        "kruispunten": kruispunten,
    }
</script>

<div style="left: {afstand}%;">

    <img src={icons[type]} alt="">
</div>

<style lang="scss"> 
    div{
        position: absolute;
        translate: -50% 0;
        width: 3rem;
        aspect-ratio: 1;
        
    }

</style>

