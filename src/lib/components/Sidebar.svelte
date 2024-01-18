<script>
    import vertrek from '$lib/images/vertrek.svg';
	import bestemming from '$lib/images/bestemming.svg';
    import editIcon from '$lib/images/edit.svg';
	import Switch from '$lib/components/Switch.svelte';
	import Basebutton from '$lib/components/Basebutton.svelte';
	import { fietsvriendelijk, expert, stoplichten, fietswegen, kruispunten } from '$lib/stores.js';
	import ObstakelOverview from '$lib/components/ObstakelOverview.svelte';
	import Checkbox from './Checkbox.svelte';

    export let vertrekpunt = 'Amsterdam Centraal';
    export let bestemmingpunt = 'Amsterdam Zuid';

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
            name: 'Obstakel 3 is echt heel lang enzo',
            description: 'Werkzaamheden aan het wegdek, maar als je cool bent dan hoeft het niet.',
            type: 'stoplicht',
            afstand: 7800,
            actief: false,
        },
    ]

    const expertOptions = [
        {
            icon: vertrek,
            name: 'Stoplichten',
            state: stoplichten,
        },
        {
            icon: vertrek,
            name: 'Fietswegen',
            state: fietswegen,
        },
        {
            icon: vertrek,
            name: 'Kruispunten',
            state: kruispunten,
        },
    ]

</script>

<section class="sidebar">
{#if $expert}
    <div style="padding: 1rem 1rem 0 1rem;">
        <h2>Expert modus</h2>
    </div>
    <hr/>
    <div class="container">
        <div class="route-display">
            <div class="route-display__edit">
                <img src={editIcon} alt="edit route">
            </div>
            <section class="route-display__locations">
                <p><span>Van</span> {vertrekpunt}</p>
                <p><span>Naar</span> {bestemmingpunt}</p>
            </section>
        </div>
    </div>
    <hr/>
    <div class="container half">
        <Basebutton label={'Terug naar basis modus'} backgroundColor='var(--color-blue-dark)' on:click={changeMode} />
    </div>
    <hr/>
    <div class="container half">
        <Switch label='Toon kaart' checked={fietsvriendelijk} />
    </div>
    <hr/>
    <section class="container half kaart-options">
        <p>Laten zien op de kaart</p>
        <ul>
        {#each expertOptions as option}
            <li>
                <button>
                    <Checkbox label={option.name} checked={option.state} />
                </button>
            </li>
        {/each}
        {#if $stoplichten}
            <p>stoplichten aan</p>
        {/if}
        {#if $fietswegen}
            <p>fietswegen aan</p>
        {/if}
        {#if $kruispunten}
            <p>fietswegen aan</p>
        {/if}
        </ul>
    </section>
{:else}
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
        <Switch label='Fietsvriendelijk' checked={fietsvriendelijk} />
    </div>
    <hr/>
    <div class="container half">
        <Basebutton label={'Route in expert modus bekijken'} backgroundColor='var(--color-blue-dark)' on:click={changeMode} />
    </div>
    <ObstakelOverview obstakels={obstakels} />
{/if}
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

        .route-display {
            display: flex;
            gap: 1rem;

            &__locations {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                width: 100%;

                p {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    span {
                        color: var(--color-grey-dark);
                    }
                }
            }
        }

        .kaart-options {
            ul {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin: 1rem 0;

                button {
                    display: flex;
                    align-items: center;
                    border: 1px solid var(--color-grey);
                    padding: 1rem;
                    width: calc(100% - 2rem);
                }
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