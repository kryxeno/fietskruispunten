<script>
	import { createSwitch } from 'svelte-headlessui'
    export let label = undefined
    export let checked

	const sw = createSwitch({ label, checked })

    $: checked = $sw.checked

</script>

<div class="switch">
    {#if label}
        <label for="switch" class="switch-label">{label}</label>
    {/if}
	<button
		class="switch-button {$sw.checked && 'active'}"
		use:sw.toggle
	>
	    <span class="{$sw.checked && 'active'}"/>
	</button>
</div>

<style lang="scss">
    .switch {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .switch-button {
            display: flex;
            align-items: center;
            background-color: var(--color-grey);
            height: 1.5rem;
            width: 3.5rem;
            border-radius: 99px;
            transition: background-color 0.2s ;
            cursor: pointer;

            &.active {
                background-color: var(--color-success-pastel);
            }

            span {
                display: block;
                background-color: var(--color-grey-dark);
                height: 2rem;
                width: 2rem;
                border-radius: 99px;
                transition: translate 0.2s, background-color 0.2s ;

                &.active {
                    translate: 1.5rem 0;
                    background-color: var(--color-success);
                }
            }
        }
    }
</style>