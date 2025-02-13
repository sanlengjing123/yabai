<template>
	<view>
		<view class="make-center">
			<view class="register-title">注册新用户</view>
		</view>
		<input placeholder="用户名" v-model="username" @blur="checkUsername" />
		<input placeholder="密码" v-model="password" @blur="checkPassword" type="password" />
		<input placeholder="确认密码" v-model="confirmPassword" @blur="checkConfirmPassword" type="password" />
		<button @click="register">注册</button>
	</view>
</template>

<script>
	import {
		Backend
	} from '../../backend.js'
	export default {
		data() {
			return {
				username: "",
				password: "",
				confirmPassword: ""
			}
		},
		methods: {
			back() {
				uni.navigateBack({});
			},
			checkUsername(a) {
				const reg = /^[a-zA-Z][0-9a-zA-Z]{2,14}$/;
				const result = this.username.match(reg);
				if (result) {} else {
					uni.showToast({
						icon: 'none',
						title: '用户名必须以字母开头，由字母和数字组成，且长度为3-16。'
					});
					return false;
				}
				return true;
			},
			checkPassword() {
				const reg1 = /[a-z]/;
				const reg2 = /[A-Z]/;
				const reg3 = /[0-9]/;
				const reg4 = /[\-`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/;
				const reg5 = /[a-zA-Z0-9\-`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/
				let count = 0;
				let {
					password
				} = this;
				count += this.password.match(reg1) ? 1 : 0;
				count += this.password.match(reg2) ? 1 : 0;
				count += this.password.match(reg3) ? 1 : 0;
				count += this.password.match(reg4) ? 1 : 0;
				const len = this.password.length;
				if (len >= 6 && len <= 32 && count >= 2 && this.password.match(reg5)) {
					return true;
				} else {
					uni.showToast({
						icon: 'none',
						title: '密码必须由数字、字母、特殊符号组成且必须包含其中两种。长度必须为6-32字符。'
					});
					return false;
				}
			},
			checkConfirmPassword() {
				if (this.password != this.confirmPassword) {
					uni.showToast({
						icon: 'none',
						title: '确认密码必须与密码相同。'
					});
					return false;
				}
				return true;
			},

			sendPost(data) {
				Backend.noTokenAPI({
					url: '/api/user/register',
					method: 'POST',
					data: data,
					success(res) {
						const data1 = res.data;
						console.log(res);
						if (data1 == "success") {
							uni.showToast({
								title: '注册成功'
							});
							setTimeout(() => {
								uni.redirectTo({
									url: "/pages/login/login"
								});
							}, 2000);
						} else {
							uni.showToast({
								title: data1,
								icon: 'error'
							});
						}
					},
					fail(err) {
						console.error('Registration failed', err);
						uni.showToast({
							title: '服务器错误'
						});
					}
				});
			},


			register() {
				if (this.checkUsername() && this.checkPassword() && this.checkConfirmPassword()) {
					const userdata = {
						username: this.username,
						password: this.password
					};
					this.sendPost(userdata);
				}
			}
		}
	}
</script>

<style>
	input {
		font-size: 40rpx;
		padding: 10rpx;
		border: 2rpx solid black;
		margin: 10rpx 0 10rpx 0;
	}

	.make-center {
		display: flex;
		justify-content: center;
	}

	.register-title {
		font-size: 60rpx;
	}
</style>