<script>
	export let vline;
	export let value;
</script>

<g class="tooltip-lines" transform="translate(0, 0)">
	<!-- vertical line -->
	<text x={vline.x2} y={vline.y1 - 10} text-anchor="middle" fill="#333" font-size="0.8rem"
		>{value}</text
	>
	<line y1={vline.y1} y2={vline.y2} x1={vline.x1} x2={vline.x2} />
</g>

<style>
	.tooltip-lines line {
		stroke: #666;
	}
</style>
