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
					<view class="person-header-btns">
						<view class="following">
							<view class="following1" @click.stop="gotoFollowing">关注</view>
							<view class="following2">{{userdata.following}}</view>
						</view>
						<view class="following">
							<view class="following1" @click.stop="gotoFollowing">粉丝</view>
							<view class="following2">{{userdata.followers}}</view>
						</view>
						<view class="following">
							<view class="following1" @click.stop="gotoBlogs">帖子</view>
							<view class="following2">{{userdata.posts}}</view>
						</view>
					</view>
					<view class="person-btns">
						<view v-if="userdata.role>=100" @click="gotoAdmin">管理员
							<image src="../../static/right-arrow.png"></image>
						</view>
						<view @click="showChangeProfile = true">个人资料</view>
						<view @click="showChangePassword = true">修改密码</view>
						<view @click="gotoHistory">浏览记录
							<image src="../../static/right-arrow.png"></image>
						</view>
						<view @click="gotoFavorites">我的收藏
							<image src="../../static/right-arrow.png"></image>
						</view>
						<view @click="gotoBlogs">博客列表
							<image src="../../static/right-arrow.png"></image>
						</view>
						<view v-if="!userdata.muteState" @click="gotoNewBlog">发布博客
							<image src="../../static/right-arrow.png"></image>
						</view>
						<view @click.stop="" v-else>禁言中不能发布博客</view>
						<view @click="gotoAbout">关于
							<image src="../../static/right-arrow.png"></image>
						</view>
						<br>
						<view @click="logout">退出登录
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

		<view class="content-background" v-if="showChangeProfile" @click.stop="profileRefresh">
			<view class="content" @click.stop="">
				<view>
					<label>昵称</label>
					<input v-model="userdata.nickName" />
				</view>
				<view>
					<label>个性签名</label>
					<input v-model="userdata.biography" />
				</view>
				<view>
					<label>年龄</label>
					<input v-model="userdata.age" @input="checkAge" maxlength="3" />
				</view>
				<view>
					<label>性别</label>
					<radio-group v-model="userdata.gender" @change="changeGender">
						<radio class="radio" value="0" :checked="userdata.gender==0">秘密</radio>
						<radio class="radio" value="1" :checked="userdata.gender==1">男</radio>
						<radio class="radio" value="2" :checked="userdata.gender==2">女</radio>
					</radio-group>
				</view>
				<view style="display: flex; justify-content: space-around;">
					<button class="confirm" @click="saveChangeProfile">确定</button>
					<button class="cancel" @click="profileRefresh">取消</button>
				</view>
			</view>
		</view>

		<view class="content-background" v-if="showChangePassword" @click.stop="profileRefresh">
			<view class="content" @click.stop="">
				<view>
					<label>当前密码</label>
					<input v-model="currentPassword" type="password" />
				</view>
				<view>
					<label>新密码</label>
					<input v-model="newPassword" type="password" />
				</view>
				<view>
					<label>确认密码</label>
					<input v-model="newPasswordConfirm" type="password" />
				</view>
				<view style="display: flex; justify-content: space-around;">
					<button class="confirm" @click="changePassword">确定</button>
					<button class="cancel" @click="profileRefresh">取消</button>
				</view>
			</view>
		</view>

		<view class="content-background" v-if="showChangeAvatar" @click.stop="profileRefresh">
			<view class="image-list" @click.stop="">
				<image v-for="(image, index) in avatarList" :key="index" @click="changeAvatar(image)" :src="image">
				</image>
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

				showChangeProfile: false,
				showChangePassword: false,
				showChangeAvatar: false,
				avatarList: [],
				currentPassword: "",
				newPassword: "",
				newPasswordConfirm: ""
			}
		},
		onShow() {
			this.profileRefresh();
			this.networkRefresh();
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
				this.showChangeAvatar = false;
				this.currentPassword = "";
				this.newPassword = "";
				this.newPasswordConfirm = "";
				const userData = Backend.getCurrentUser();
				this.userdata = userData;
			},
			networkRefresh() {
				const this1 = this;
				Backend.api({
					url: "/api/user/update",
					success(response) {
						const data = response.data;
						if (data.result == "success") {
							Backend.setCurrentUser(data.userData);
							this1.profileRefresh();
						}
					}
				});
			},
			saveChangeProfile() {
				this.saveUser();
			},
			showChangeAvatar1() {
				const this1 = this;
				this.showChangeAvatar = true;
				Backend.api({
					url: "/api/fun/random-image-urls",
					success(response) {
						this1.avatarList = response.data;
					}
				});
			},
			changePassword() {
				if (this.newPassword == this.newPasswordConfirm) {
					const this1 = this;
					Backend.noTokenAPI({
						url: "/api/user/change-password",
						method: "POST",
						data: {
							username: this.userdata.name,
							password: this.currentPassword,
							newPassword: this.newPassword
						},
						success(response) {
							if (response.data == "success") {
								uni.showToast({
									title: '修改密码成功',
								});
								this1.profileRefresh();
							} else if (response.data == "password_wrong") {
								uni.showToast({
									title: '密码错误',
									icon: 'error'
								});
							} else {
								uni.showToast({
									title: '错误 ' + response.data,
									icon: 'error'
								});
							}
						},
						fail(reason) {
							uni.showToast({
								title: '请求错误',
								icon: 'error'
							});
						},
						complete() {

						}
					});
					// console.log(this.userdata);
					// if (this.currentPassword == this.userdata.password) {
					// 	this.userdata.password = this.newPassword;
					// 	this.saveUser();
					// 	uni.showToast({
					// 		title: '修改密码成功',
					// 		duration: 2000
					// 	});
					// 	this.profileRefresh();
					// } else {
					// 	uni.showToast({
					// 		title: '必须正确输入原密码',
					// 		duration: 2000,
					// 		icon: 'error'
					// 	});
					// }
				} else {
					uni.showToast({
						title: '确认密码必须和新密码一致',
						duration: 2000,
						icon: 'error'
					});
				}
			},
			changeGender(e) {
				this.userdata.gender = e.detail.value;
			},
			checkAge(e) {
				console.log(e.target.value);
			},
			changeAvatar(img) {
				this.userdata.avatarUrl = img;
				console.log(this.userdata.avatarUrl);
				this.saveUser();
			},
			saveUser() {
				Backend.modifyCurrentUser(this.userdata, this.networkRefresh);

			},
			logout() {
				Backend.logout();
				uni.showToast({
					icon: 'none',
					title: '退出登录'
				});
				setTimeout(() => {
					this.profileRefresh();
				}, 1000);
			},
			gotoAdmin(){
				uni.navigateTo({
					url: "/pages/admin/admin"
				});
			},
			gotoLogin() {
				uni.navigateTo({
					url: "/pages/login/login"
				});
			},
			gotoRegister() {
				uni.navigateTo({
					url: "/pages/register/register"
				});
			},
			gotoHistory() {
				uni.navigateTo({
					url: "/pages/history/history"
				});
			},
			gotoFollowing() {
				uni.navigateTo({
					url: "/pages/following/following?id=" + this.userdata.id
				});
			},
			gotoFavorites() {
				uni.navigateTo({
					url: "/pages/favorites/favorites?id=" + this.userdata.id
				});
			},
			gotoBlogs() {
				uni.navigateTo({
					url: "/pages/profile/profile?id=" + this.userdata.id
				});
			},
			gotoNewBlog() {
				uni.navigateTo({
					url: "/pages/postBlog/postBlog"
				});
			},
			gotoAbout() {
				uni.navigateTo({
					url: "/pages/about/about"
				});
			}
		}
	}
</script>

<style>
	.left-side {
		max-width: 1000rpx;
		flex: 1;
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

	.person-header-btns {
		display: flex;
		justify-content: space-evenly;
	}

	.following {}

	.following1 {
		font-size: 36rpx;
		font-weight: bold;
		text-align: center;
	}

	.following2 {
		font-size: 36rpx;
		text-align: center;
	}

	.person-btns {}

	.person-btns view {
		width: auto;
		/* background-color: azure; */
		padding: 16rpx;
		border: 2rpx solid darkgray;
		border-left: 0px;
		border-right: 0px;
		display: flex;
		justify-content: space-between;
		background: linear-gradient(to right, white, #eee);
		font-size: 32rpx;
	}

	.person-btns image {
		width: 40rpx;
		height: 40rpx;
		display: inline-block;
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

	.radio {
		padding: 0 50rpx 0 0;
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