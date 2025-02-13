<template>
	<view>
		<view class="main">
			<view class="item" v-for="blog in blogs" :key="blog.id" @tap="goDetail(blog.id)">
				<view class="top">
					<view class="up1">
						<view class="title">
							{{blog.title}}
						</view>
						<button @click.stop="" @click="whole(blog)"
							:class="['guanzhu',blog.liked?'type':'type_tips']">{{blog.liked?'取消收藏':'+收藏'}}</button>
					</view>
					<view class="timess">
						<span>{{blog.author}}</span>
						<span>{{blog.createTime}}</span>
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
				<view class="down1">
					<view class="favorite">收藏量：{{blog.like}}</view>
					<view class="comment">评论数：{{blog.reply}}</view>
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
				blogs:[],
				userId: 0
			}
		},
		onLoad(option) {
			this.userId = option.id;
			this.getBlogs();
		},

		methods: {
			goDetail(id) {
				uni.navigateTo({
					url: "/pages/detail/detail?id=" + id
				})
			},
			whole(blog) {
				// 当点击第一次时，ys1从true变为false,Style样式type就会隐藏
				// 再点击第二次的时候由false,变为true,显示样式
				blog.liked = !blog.liked;
				Backend.favoritePost(blog.id, 1, blog.liked);
			},
			getBlogs() {
				const this1 = this;
				Backend.api({
					url: '/api/blog/search?favoritedBy=' + this.userId,
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
						}
						this1.blogs = response.data;
						console.log(this1.blogs);
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

	.up1 {
		display: flex;
		justify-content: space-between;

	}

	.timess {
		color: #A5ADB5;
		display: flex;
		justify-content: space-between;
	}

	.title {
		font-size: 50rpx;
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
		width: 200rpx;
		height: 80rpx;
		margin: 0;
	}

	.middle1 {
		margin: 10rpx;
	}

	.content {
		font-size: 40rpx;
	}

	.picture {
		display: flex;
	}

	.picture image {
		width: 200rpx;
		height: 200rpx;
		margin: 10rpx;
	}


	.down1 {
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
</style>