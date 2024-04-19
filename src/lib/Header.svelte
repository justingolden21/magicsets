<script>
	export let text = '';
	function toggleFullscreen() {
		if (
			!document.fullscreenElement &&
			!document.webkitFullscreenElement &&
			!document.mozFullScreenElement &&
			!document.msFullscreenElement
		) {
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen();
			} else if (document.documentElement.msRequestFullscreen) {
				document.documentElement.msRequestFullscreen();
			} else if (document.documentElement.mozRequestFullScreen) {
				document.documentElement.mozRequestFullScreen();
			} else if (document.documentElement.webkitRequestFullscreen) {
				document.documentElement.webkitRequestFullscreen();
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
		}
	}

	function toggleDark() {
		document.body.classList.toggle('dark');
	}

    // todo: localstorage dark mode
</script>

<header class="flex justify-between items-center mb-8">
	<slot></slot>

	<h1 class="text-2xl text-center">{text}</h1>

	<div class="flex gap-2">
		<button class="btn-icon" title="Fullscreen" on:click={toggleFullscreen}>
			<svg
				class="w-4 h-4"
				fill="none"
				stroke-width="1.5"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="m4 8v-4h4m8 0h4v4m0 8v4h-4m-8 0h-4v-4"></path>
			</svg>
		</button>
		<button class="btn-icon" title="Toggle dark mode" on:click={toggleDark}>
			<svg
				class="w-4 h-4"
				fill="none"
				stroke-width="1.5"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="m22 15a10 10 0 01-13-13 10 10 0 00-6 9 10 10 0 0019 4"></path>
			</svg>
		</button>
	</div>
</header>
