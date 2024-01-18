<script>
	import { createSwitch } from 'svelte-headlessui'
    export let label = undefined
    export let checked

    let checkedValue = checked && typeof checked.subscribe === 'function'
        ? checked
        : { subscribe: (fn) => fn(checked) };

    console.log(checkedValue);
	const sw = createSwitch({ label, checked: $checkedValue })

    $: $checkedValue = $sw.checked

</script>

<div class="switch" use:sw.toggle>
    {#if label}
        <label for="switch" class="switch-label">{label}</label>
    {/if}
	<button
		class="switch-button {$sw.checked && 'active'}"
	>
	    <span class="{$sw.checked && 'active'}"/>
	</button>
</div>

<style lang="scss">
    .switch {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .switch-button {
            display: flex;
            align-items: center;
            background-color: var(--color-grey);
            height: 1.2rem;
            width: 3rem;
            border-radius: 99px;
            transition: background-color 0.2s ;
            cursor: pointer;

            &.active {
                background-color: var(--color-success-pastel);
            }

            span {
                display: block;
                background-color: var(--color-grey-dark);
                height: 1.8rem;
                width: 1.8rem;
                border-radius: 99px;
                transition: translate 0.2s, background-color 0.2s ;

                &.active {
                    translate: 1.2rem 0;
                    background-color: var(--color-success);
                }
            }
        }
    }
</style>