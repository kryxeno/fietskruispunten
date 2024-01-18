<script>
	import Switch from "$lib/components/switch.svelte";
    import { metersToKilometers } from '$lib/utils/numbers.js';

    export let obstakels = []
</script>

<section class="obstakel-overview">
    <div class="counter container">
        Obstakels <span>&nbsp;({obstakels.length})</span>
    </div>
    <ul class="obstakels">
        {#each obstakels as obstakel}
            <li class="obstakel container">
                <div class="obstakel__icon">
                    <!-- <img src={obstakel.icon} alt={obstakel.name} /> -->
                </div>
                <div class="obstakel__info">
                    <div class="obstakel__info-top">
                        <h3>{obstakel.name}</h3>
                        <p>{metersToKilometers(obstakel.afstand)}</p>
                        <Switch checked={obstakel.actief} />
                    </div>
                    <p>{obstakel.description}</p>
                </div>
            </li>
        {/each}
    </ul>
</section>

<style lang="scss">
    .obstakel-overview {
        display: flex;
        flex-direction: column;
        border: 1px solid var(--color-grey);

        .counter {
            display: flex;
            justify-content: center;
            align-items: center;
            span {
                font-weight: 600;
            }
        }

        .container {
            padding: 1.5rem;
        }

        .obstakels {
            display: flex;
            flex-direction: column;

            .obstakel {
                display: flex;
                align-items: center;
                border-top: 1px solid var(--color-grey);
                background-color: #FAFAFA;

                &__info {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    gap: 0.5rem;

                    p {
                        font-size: 0.9rem;
                    }

                    &-top {
                        display: grid;
                        grid-template-columns: 1fr 5rem 4rem;
                        align-items: center;
                        gap: 0.5rem;

                        h3 {
                            font-size: 1rem;
                            font-weight: 400;
                            color: var(--color-blue-dark);
                        }

                        p {
                            font-size: 1rem;
                        }
                    }
                }
            }
        }
    }
</style>