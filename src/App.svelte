<script>
	import io from "socket.io-client";
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
  import Menu from "./Menu.svelte";
  import User from "./User.svelte";
	import WinnerTable from "./WinnerTable.svelte"
	let name = "";
	let loggedIn = false;
	let started = false;
	let loginError = null;
	let isAdmin = false;
	let timeToStart;
	let users = [];
	let showWinners = false;
	let winners = [];
	const socket = io();
	socket.on('start', (data) => {
		started = true;
		timeToStart = tweened(data.secondsToStart);
		startCounter(`https://cssbattle.dev/play/${data.gameId}`);
		
	})
	socket.on('user-change', (data) => {
		if(socket.id == data.socketId){
			loggedIn = true;
		}
		console.log(data)
		users = data.userData;
	})
	socket.on('admin-users', (data) => {
		loggedIn = true;
		isAdmin = true;
		users = data;
	})
	socket.on('username-error', (message) => {
		loginError = message;
	})
	socket.on('reset', (data) => {
		if(!isAdmin){
			loggedIn = false;
		}
		started = false;
		name = "";
	})
	socket.on('display-winners', (data)=>{
		console.log(data);
		winners = data;
		showWinners = true;
	})
	socket.on('display-main-menu', () => {
		console.log('Display main menu')
		if (loggedIn)
			showWinners = false;
	})
	function submit(){
		loginError = null;
		socket.emit('login', {name, socketId: socket.id});
	}
	function startCounter(url){
		var id = setInterval(() => {
			if ($timeToStart > 0) {
				$timeToStart--;
			}
			else{
				clearInterval(id);
				if(!isAdmin){
					window.location.href = url;
				}
				

			}
		}, 1000);
	}
	$: seconds = Math.floor($timeToStart)
</script>

<main>
	{#if !loggedIn}
		<div class="login">
			<img src="images/mpya-css-battle-logo.png"/>
			<label for="username">
				Username
			</label>
			<input 
				name="username"
				placeholder="Your username"
				bind:value={name}
			/>
			{#if loginError}
				<span>{loginError}</span>
			{/if}
			<button on:click={submit} disabled={name.length <= 0}>Get Started</button>
		</div>
	{:else}
		<div class="middle">
			<Menu 
				showWinners={showWinners} 
				isAdmin={isAdmin}
			/>
			{#if started}	
				{#key seconds}
					<h1 
						in:fly="{{delay: 0, duration: 300, x: -100, y: 0, opacity: 0, easing: quintOut}}"
						out:fly="{{delay: 0, duration: 300, x: 100, y: 0, opacity: 0, easing: quintOut}}"
					>
						{seconds}
					</h1>
				{/key}
			{:else}
				<div class="users"> 
					{#if showWinners}
						<WinnerTable 
							winners={winners}	
						/>	
					{:else}
						<h1>Contestants</h1>
						<div class={"userGrid"}>
							{#each users as user}
								<User
									name={user.name}
									points={user.points}
									pointsToAdd={users.pointsToAdd}
									canChangePoints={!showWinners && isAdmin}
								/>
							{/each}
						</div>
					{/if}
				</div>	
			{/if}
		</div>
	{/if}
</main>

<style global>
	main {
		display: flex;
		text-align: center;
		height: 100%;
		margin: 0 auto;
		background: white;
		color: white;
		min-height: calc(100vh - 2em);
	}
	input{
		display: block;
	}
	.login{
		display: flex;
		flex-direction: column;
		max-width: 23em;
		margin: auto;
	}
	label{
		text-align: left;
		padding: 0.5em 0;
	}
	.middle{
		height: 100%;
		width: 100%;
		display: flex;
		min-height: 140px;
	}
	.users{
		width: 100%;
		display: flex;
		flex-direction: column;
		background: #E34586;
		overflow-y: scroll;
	}
	.userGrid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
	}
  h1 {
		padding: 20px 0;
  }
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	@media screen and (max-width: 940px) {
		.middle {
			flex-direction: column;
			align-items: center;
		}

		.users {
			margin-top: 20px;
			overflow-y: unset;
		}
	}
</style>