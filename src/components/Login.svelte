<script>
	export let socket
	let name = ''
	let loginError = null;

	socket.on('username-error', (message) => {
		loginError = message;
	})

	const submit = () => {
		loginError = null;
		socket.emit('login', {name, socketId: socket.id});
	}
</script>

<div class="login flex--column">
	<img src="images/mpya-css-battle-logo.png"/>

	<label for="username">
		Username
	</label>
	<input 
		name="username"
		placeholder="Your username"
		bind:value={name}
	/>
	<button on:click={submit} disabled={name.length <= 0}>Get Started</button>
	<span 
		class={`error text-align-center ${!loginError ? 'hidden' : '' }`}
	>
		{loginError}
	</span>
</div>

<style>
	.login {
		margin: auto;
	}

	label {
		padding: var(--padding-small) 0;
	}
	
	.error {
		color: red;
		padding: var(--padding-small) 0;
	}
</style>