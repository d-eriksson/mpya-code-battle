<script>
	import io from "socket.io-client";
	let name = "";
	let loggedIn = false;
	const socket = io("http://localhost:5001")
	socket.on('start', (data) => {
		console.log(data);
		name="start";
	})
	let users = [];
	socket.on('user-added', (data) => {
		console.log(data);
		users = data;
	})
	function submit(){
		loggedIn = true;
		socket.emit('login', {name});
	}	
	

</script>

<main>
	{#if loggedIn}
	<ul>
		{#each users as user}
			<li>{user.name}</li>
		{/each}
	</ul>
	{:else}
		<input bind:value={name}>
		<button on:click={submit} disabled={name.length <= 0}>Get Started</button>
	{/if}
	
	
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>