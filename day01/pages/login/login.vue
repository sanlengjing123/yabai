<template>

	<view class="bg">
		<view class="pic">
			<image class="tip" src="../../static/logo.png"></image>
		</view>
		<view class="login">

			<view class="e-input">
				<input placeholder="用户名" v-model="username" required />
			</view>
			<view class="e-input">
				<input placeholder="密码" v-model="password" type="password" required />
			</view>
			<!-- 				<view class="submit">
					
				</view> -->
			<view style="margin: 30rpx 20rpx 30rpx 20rpx; display: flex; align-items: right; justify-content: right;">
				没有账号？<span class="register-link" @click="goRegister">点我注册！</span>
			</view>

			<button class="login-button" @click="login">登录</button>
		</view>
	</view>
</template>

<script>
	import {
		Backend
	} from '../../backend';
	export default {
		data() {
			return {
				username: "",
				password: ""
			}
		},
		methods: {
			login() {
				const user = {
					username: this.username,
					password: this.password
				};

				Backend.noTokenAPI({
					url: '/api/user/login',
					method: 'POST',
					data: user,
					success(res) {
						const data1 = res.data;
						if (data1.result == 'success') {
							console.log('login successful', data1);
							uni.showToast({
								title: '登录成功'
							});
							Backend.setCurrentUser(data1.userData);
							Backend.setToken(data1.token);
							setTimeout(() => {
								uni.switchTab({
									url: "/pages/person/person"
								});
							}, 2000);
						} else {
							uni.showToast({
								title: '登录失败',
								icon: 'error'
							});
						}
					},
					fail(err) {
						console.error('login failed', err);
						uni.showToast({
							title: '连接失败',
							icon: 'error'
						});
					}
				});
			},
			goRegister() {
				uni.navigateTo({
					url: "/pages/register/register"
				})
			}

		}
	}
</script>

<style>
	.pic {
		height: 400rpx;
		width: auto;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.tip {
		height: 200rpx;
		width: 200rpx;

	}

	.e-input {

		background-color: white;
		margin-top: 40rpx;
		display: flex;
		border-radius: 5rpx;

	}

	.e-input>input {
		padding-left: 10rpx;
		box-sizing: border-box;
		height: 90rpx;

		font-size: 25px;

	}

	/* 	.e-input>input :valid {
	  background-color: #fff;
	}
	.e-input>input :invalid {
	  background-color: #f99;
	} */

	.register-link {
		color: blue;
		font: "黑体";

	}

	.bg {
		/* 计算属性 */
		height: calc(100vh - 50px);
		position: relative;
		background-image: url("../../static/1.png");
	}

	.login {
		top: 200rpx;
		height: 300px;
		/* 在iphone6中，1px=2rpx  整个屏幕的宽度可以看成750rpx */
		max-width: 1000rpx;

	}

	.login-button {
		margin: 15rpx;
		box-shadow: 2px 2px 2px 0px #111;
		color: black;
	}
</style>