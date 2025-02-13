<template>
	<view>
		<view class="main-container">
			<view class="left-side">
				<template v-if="userdata">
					<view class="person-icon-container">
						<image :src="userdata.avatarUrl" @click.stop="showChangeAvatar1"></image>
					</view>
					<view class="person-icon-container">
						<view class="person-user-name">{{ userdata.nickName}}</view>
					</view>
					<view class="naver">
						<view class="adviser" @click="gotoIllegal">
							<view>待审核</view>
							<view class="digital">
								{{state.numExamination}}
							</view>
						</view>
						<view class="adviser" @click="gotoIllegal">
							<view>已打回</view>
							<view class="digital">
								{{state.numDisapproval}}
							</view>
						</view>
						<view class="adviser" @click="gotoSilence">
							<view>禁言用户</view>
							<view class="digital">
								{{state.numMuted}}
							</view>
						</view>

						<view class="adviser" @click="gotoAdvise">
							<view>管理员推荐</view>
							<view class="digital">
								{{99999}}
							</view>
						</view>

						<view class="adviser">
							<view>帖子总量</view>
							<view class="digital">
								{{state.numPosts}}
							</view>
						</view>
						<view class="adviser">
							<view>注册总量</view>
							<view class="digital">
								{{state.numUser}}
							</view>
						</view>
						<view class="adviser">
							<view>今日发帖数</view>
							<view class="digital">
								{{state.numPostToday}}
							</view>
						</view>

						<view class="adviser">
							<view>今日注册</view>
							<view class="digital">
								{{state.numRegisterToday}}
							</view>
						</view>

						<view class="adviser">
							<view>今日跟帖数</view>
							<view class="digital">
								{{state.numReplyToday}}
							</view>
						</view>
					</view>

				</template>
				<template v-else>
					请先登录
					<view>
						<button @click="gotoLogin">登录</button>
						<button @click="gotoRegister">注册</button>
					</view>
				</template>

			</view>
		</view>

	</view>
</template>

<script>
	import {
		Backend
	} from '../../backend.js';
	export default {
		data() {
			return {
				userdata: {
					avatar: "/static/logo"
				},

				// 	showChangeProfile: false,
				showChangePassword: false,
				currentPassword: "",
				state: {}
			}

		},
		onShow() {
			this.profileRefresh();
			const this1 = this;
			Backend.api({
				url: "/api/manager/system-state",
				success(resp) {
					this1.state = resp.data;
				}
			});
		},

		onPullDownRefresh() {
			console.log("页面开始下拉");
			/* 开启下拉刷新 */
			uni.startPullDownRefresh({
				success() {},
				fail() {}
			});
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 2000);
		},
		/* onReachBottom 页面上拉触底监听 */
		onReachBottom() {

		},
		methods: {
			profileRefresh() {
				this.showChangeProfile = false;
				this.showChangePassword = false;
				this.currentPassword = "";
				const userData = Backend.getCurrentUser();
				this.userdata = userData;
			},
			gotoSilence() {
				uni.navigateTo({
					url: "/pages/silence/silence"
				});
			},
			gotoIllegal() {
				uni.navigateTo({
					url: "/pages/examine/examine"
				});
			},
			gotoAdvise() {
				uni.navigateTo({
					url: "/pages/history/history"
				});
			}
		}
	}
</script>

<style>
	.left-side {
		width: 100%;
		max-width: 1000rpx;
	}

	.main-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.person-user-name {
		font-weight: 700;
		font-size: 60rpx;
	}

	.person-icon-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}

	.person-icon-container image {
		width: 300rpx;
		height: 300rpx;
		border-radius: 50%;
	}

	.naver {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;

	}

	.adviser {
		width: 220rpx;
		padding-top: 10rpx;
	}

	.adviser view {
		font-size: 36rpx;
		justify-content: center;
		display: flex;
	}

	.digital {
		font-size: 35rpx;
		font-weight: bold;
		display: flex;
		justify-content: center;
		border-bottom: 2rpx solid gray;
	}


	/* 	.person-btns view::after{
		content: '';
		width: 10rpx;
		height: 10rpx;
		
		display: inline-block;
		background: url('/static/right-arrow.png');
		background-size: 100% 100%;
	} */

	.content-background {
		min-height: 100%;
		position: absolute;
		top: 0;
		width: 100%;
		background-color: #aaaaaa77;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.content {
		margin: 120rpx 10rpx;
		padding: 10rpx;
		width: auto;
		max-width: 1400rpx;
		background-color: #ffffffee;
	}

	.content view {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #eee;
		padding: 20rpx;
		font-size: 36rpx;
	}

	.content input {
		height: 60rpx;
		font-size: 34rpx;
		border-bottom: 1px solid #888;
	}

	.content label {
		margin: 0 20rpx 0 0;
	}

	.image-list {
		margin: 120rpx 10rpx;
		padding: 10rpx;
		width: auto;
		max-width: 1400rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		background-color: #ffffffee;
	}

	.image-list image {
		width: 200rpx;
		height: 200rpx;
		margin: 10rpx;
	}

	.confirm {
		padding: 0 80rpx;
		background: linear-gradient(to bottom, #bfb, #2f2);
	}

	.cancel {
		padding: 0 80rpx;
		background: linear-gradient(to bottom, #fff, #ddd);
	}
</style>