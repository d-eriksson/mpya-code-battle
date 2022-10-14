<script>
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let seconds
</script>

<div class="overlay center height--full width--full">
	<div class="countdown width--full center flex--row">
		{#key seconds}
			<h1 
				class="center"
				in:fly="{{delay: 0, duration: 300, x: -100, y: 0, opacity: 0, easing: quintOut}}"
				out:fly="{{delay: 0, duration: 300, x: 100, y: 0, opacity: 0, easing: quintOut}}"
			>
				{seconds}
			</h1>
		{/key}
	</div>
</div>

<style>
	.overlay{
		position: fixed;
		z-index: 1;
		background: rgba(0, 0, 0, 0.55);
	}

	.countdown {
		position: absolute;
		justify-content: center;
		background: var(--mpya-pink);
		z-index: 1;
		height: 80px;
	}

	.countdown h1 {
		position: absolute;
	}
</style>