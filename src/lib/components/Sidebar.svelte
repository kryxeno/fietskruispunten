<script>
    import vertrek from '$lib/images/vertrek.svg';
	import bestemming from '$lib/images/bestemming.svg';
	import Switch from '$lib/components/Switch.svelte';
	import Basebutton from '$lib/components/Basebutton.svelte';
	import { fietsvriendelijk, expert } from '$lib/stores.js';
	import ObstakelOverview from '$lib/components/ObstakelOverview.svelte';

    const changeMode = () => $expert = !$expert

    const obstakels = [
        {
            name: 'Obstakel 1',
            description: `Auto's moeten fietsers voorrang verlenen`,
            type: 'stoplicht',
            afstand: 2200,
            actief: true,
        },
        {
            name: 'Obstakel 2',
            description: 'Druk kruispunt',
            type: 'stoplicht',
            afstand: 5000,
            actief: true,
        },
        {
            name: 'Obstakel 3',
            description: 'Werkzaamheden aan het wegdek',
            type: 'stoplicht',
            afstand: 7800,
            actief: false,
        },
    ]

</script>

<section class="sidebar">
    <div style="padding: 1rem 1rem 0 1rem;">
        <h2>Mijn fietsroute</h2>
    </div>
    <hr/>
    <div class="container">
        <div class="inputs">
            <div class="icons">
                <div class="circle start">
                    <img src={vertrek} alt="starting point" />
                </div>
                <div />
                <div class="circle end">
                    <img src={bestemming} alt="ending point" />
                </div>
            </div>
            <div class="geocoder">
                <input
                    type="datetime-local"
                    id="datePicker"
                    value={new Date().toISOString().slice(0, 16)}
                />
            </div>
        </div>
    </div>
    <hr/>
    <div class="container half">
        <Switch label='Fietsvriendelijk' checked={$fietsvriendelijk} />
    </div>
    <hr/>
    <div class="container half">
        <Basebutton label={$expert ? 'Route in expert modus bekijken' : 'Terug naar basis modus'} backgroundColor='var(--color-blue-dark)' on:click={changeMode} />
    </div>
    <ObstakelOverview obstakels={obstakels} />
</section>

<style lang="scss">
	@import '$lib/leaflet-style.css';

    .sidebar {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        z-index: 1000;
        overflow: hidden;

        hr {
            flex-shrink: 0;
        }

        .container {
            padding: 1rem 1rem;

            &.half {
                padding: 0.5rem 1rem;
            }
        }

        .inputs {
            display: flex;

            .icons {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 0.5rem 1rem 0.5rem 0;

                div {
                    height: 1.4rem;
                    border-right: 2px solid var(--color-grey);
                    width: 2px;
                }
                .circle {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                    width: 1.75rem;
                    height: 1.75rem;
                    border-radius: 50%;
                    background: var(--color-grey);

                    img {
                        translate: 1px 0;
                    }
                }
            }

            .geocoder {
                display: flex;
                flex-direction: column;
                gap: 0.6rem;

                input {
                    border: 1px solid var(--color-grey);
                    padding: 0.5rem 1rem;
                }
            }
        }
    }
</style>