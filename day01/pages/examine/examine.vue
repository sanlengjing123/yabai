<template>
	<view>
		<view class="main">
			<view class="item" v-for="blog in blogs" :key="blog.id" @tap="goDetail(blog.id)">
				<view class="top">
					<view class="but">
						<button @click.stop="" @click.stop="approve(blog)"
							:class="['guanzhu',blog.ok?'type':'type_tips']">{{blog.ok?'已通过':'点击通过'}}</button>
						<button class="disp" @click.stop="" @click.stop="ShowDisapprove = true; currentPostId=blog.id">
							打回
						</button>
					</view>
					<view class="con">
						<view class="up1">
							<view class="title">{{blog.title}}</view>
						</view>
						<view class="times">
							<span>{{blog.author}}</span>
							<span>{{blog.createTime}}</span>
						</view>
					</view>
				</view>

				<view class="middle1">
					<view class="content">
						{{blog.content}}
					</view>
					<view class="picture">
						<image v-for="(image,index) in blog.images" :key="index" :src="image"></image>
					</view>

				</view>
				<view class="bottom">
					<view class="favorite">收藏量：{{blog.like}}</view>
					<view class="comment">评论数：{{blog.reply}}</view>
				</view>
			</view>
		</view>

		<view class="content-disapprove" v-if="ShowDisapprove" @click.stop="clear">
			<view class="content" @click.stop="">
				<view>
					<label>打回理由</label>
					<input v-model="reason" />
				</view>

				<view style="display: flex; justify-content: space-around;">
					<button class="confirm" @click="disapprove">确定</button>
					<button class="cancel" @click="clear">取消</button>
				</view>
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
				// blogs: [{
				// 		id: 1,
				// 		author: '张三',
				// 		imageUrl: require('../../static/head.jpg'),
				// 		title: '滑雪去了',
				// 		favorite: '1.2w',
				// 		flag: false,
				// 		comment: 1074,

				// 		createTime: '2020-01-02'
				// 	},
				// 	{
				// 		id: 2,
				// 		author: '李四',
				// 		imageUrl: require('../../static/head.jpg'),
				// 		title: '乌拉',
				// 		favorite: '1.2w',
				// 		flag: false,
				// 		comment: 1077,

				// 		createTime: '2020-01-22'
				// 	},
				// 	{
				// 		id: 3,
				// 		author: '王五',
				// 		imageUrl: require('../../static/news.jpg'),
				// 		title: '武忠祥和张宇打起来了',
				// 		favorite: '1.2w',
				// 		flag: false,

				// 		comment: 10790,
				// 		createTime: '2020-01-02'
				// 	},
				// 	{
				// 		id: 4,
				// 		author: '赵6',
				// 		imageUrl: require('../../static/news.jpg'),
				// 		title: '就这？？？？？',

				// 		favorite: '1.2w',
				// 		flag: false,

				// 		comment: 1055,
				// 		createTime: '2020-01-02'
				// 	}
				// ],
				ShowDisapprove: false,
				blogs: [],
				userId: 0,
				currentPostId: 0,
				reason: ""
			}
		},
		onLoad(option) {
			this.userId = option.id;
			this.clear();
			this.getBlogs();
		},


		methods: {
			clear() {
				const userData = Backend.getCurrentUser();
				this.userdata = userData;
				this.ShowDisapprove = false;
			},
			goDetail(id) {
				uni.navigateTo({
					url: "/pages/detail/detail?id=" + id
				})
			},
			getBlogs() {
				const this1 = this;
				Backend.api({
					url: '/api/manager/examine-list',
					method: 'GET',
					success(response) {
						const value = response.data;
						for (let i = 0; i < value.length; i++) {
							if (!value[i].liked)
								value[i].liked = false;
							if (!value[i].like)
								value[i].like = 0;
							if (!value[i].reply)
								value[i].reply = 0;
							if (!value[i].ok)
								value[i].ok = false;
						}
						this1.blogs = response.data;
						console.log(this1.blogs);
					}
				});
			},

			approve(blog) {
				blog.ok = !blog.ok;

				Backend.api({
					url: '/api/manager/approve-post',
					method: 'POST',
					data: {
						postId: blog.id,
						approval: blog.ok
					},
					success(response) {
						if (response.data != "success") {
							uni.showToast({
								title: "操作失败",
								icon: 'error'
							});
							console.log(response.data);
						}
					},
					fail(err) {
						uni.showToast({
							title: "操作失败/n" + err,
							icon: 'error'
						});
					}
				});
			},

			disapprove() {
				Backend.api({
					url: '/api/manager/disapprove-post',
					method: 'POST',
					data: {
						postId: blog.id,
						reason: blog.ok
					},
					success(response) {
						console.log(response.data);
					}
				});
			}
		}
	}
</script>
<style>
	.item {
		margin: 20rpx auto;
		background-color: white;
		padding: 20rpx 30rpx 30rpx 30rpx;
		box-sizing: border-box;
	}

	.but {
		display: flex;


	}

	.up1 {
		display: flex;
		justify-content: space-between;

	}


	.times {
		color: #A5ADB5;
		display: flex;
		justify-content: space-between;
	}

	.title {
		font-size: 44rpx;
		font-weight: bold;
		white-space: nowrap;
		/* 禁止换行 */
		text-overflow: ellipsis;
		/* 超出部分的文本用省略号表示 */
		overflow-x: hidden;
		/* 超出部分在x方向隐藏 */
	}

	.type {
		background-color: #fff;
		color: #7c7c7c;
	}

	.type_tips {
		background: darkgray;
		color: #fff;
	}

	.guanzhu {
		width: 250rpx;
		height: 80rpx;
		margin: 0;
		border: 2rpx solid grey;

	}

	.disp {
		width: 250rpx;
		height: 80rpx;
		margin: 0;
		background-color: #ff415d;
	}

	.middle1 {
		margin: 10rpx;
	}

	.content {
		font-size: 38rpx;
	}

	.picture {
		display: flex;
	}

	.picture image {
		width: 200rpx;
		height: 200rpx;
		margin: 10rpx;
	}


	.bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}



	.item .keyword {
		height: 80rpx;
		overflow-y: hidden;
	}

	.main {
		background-color: #dcdcdc;
		min-height: 100vh;
		border: 1rpx solid #dcdcdc;
	}

	.content-disapprove {
		min-height: 100%;
		position: absolute;
		top: 0;
		width: 100%;
		background-color: #aaaaaa77;
		display: flex;
		justify-content: center;
		align-items: center;
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

	.confirm {
		padding: 0 80rpx;
		background: linear-gradient(to bottom, #bfb, #2f2);
	}

	.cancel {
		padding: 0 80rpx;
		background: linear-gradient(to bottom, #fff, #ddd);
	}
</style>