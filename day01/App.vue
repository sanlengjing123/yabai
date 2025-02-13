<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
			/*
#ifdef H5
#endif
*/
		},
		onHide: function() {
			console.log('App Hide')
		},
		onLoad() {

		},
		onError(error) {

		},
		onPullDownRefresh() {
			console.log("开始下拉");
			uni.startPullDownRefresh({
				success() {

				},
				fail() {

				}
			});
			setTimeout(() => {
				uni.stopPullDownRefresh();
			});
		},
		onReachBottom() {},
		onShareAppMessage() {

		},
		onPageScroll() {

		},
		onNavigationBarButtonTap() {

		}
	}
</script>

<style>
	/*每个页面公共css */
</style>