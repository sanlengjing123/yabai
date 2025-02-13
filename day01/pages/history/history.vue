<template>
	<view>
		<view class="main">
			<view style="height: 60rpx;"></view>
			<view class="item" v-for="article in articles" :key="article.id" @tap="goDetail(article.id)">

				<view class="up1">
					<view class="headportrait">
						<image :src="article.imageUrl"></image>
					</view>
					<view class="author">
						{{article.author}}
					</view>
				</view>
				<view class="middle1">
					<view class="title">{{article.title}}</view>

				</view>
				<view class="picture">
					<!-- <image :src="article.imageUrl"></image> -->
					<image v-for="(img,index1) in article.images" :key="index1" :src="img"></image>
				</view>

				<view class="down1">
					<view class="favorite">喜欢：{{article.like}}</view>
					<!-- <view class="comment">评论：{{article.comment}}</view> -->
				</view>
			</view>
		</view>

		<!-- 导航区域 -->
		<view class="nav">
			<view :class="['menu',item.id==currentId?'active':'']" v-for="item in currentMenus" :key="item.id"
				@tap="check(item.id)">
				{{item.name}}
			</view>
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
				menus: [{
						id: 1,
						name: '赞'
					},
					{
						id: 2,
						name: '收藏'
					},
					{
						id: 3,
						name: '视频'
					},
					{
						id: 4,
						name: '文章'
					},
					{
						id: 5,
						name: '问答'
					},
					{
						id: 6,
						name: '图片'
					}

				],
				currentMenus: [],
				n: false,
				currentId: 1,
				// articles: [{
				// 		id: 1,
				// 		author: '张三',
				// 		title: '电脑主机 外置usb蓝牙适配器 连接后声音断续',
				// 		imageUrl: require('../../static/head.jpg'),
				// 		headpo: require('../../static/head.jpg'),

				// 		favorite: 666,
				// 		comment: 113,
				// 	},
				// 	{
				// 		id: 2,
				// 		author: '李四',
				// 		title: 'CSS中的position定位和flex布局分析',
				// 		imageUrl: require('../../static/head.jpg'),

				// 		favorite: 124,
				// 		comment: 1665,
				// 	},
				// 	{
				// 		id: 3,
				// 		author: '王五',
				// 		title: 'Hbuilder常用快捷健',
				// 		imageUrl: require('../../static/news.jpg'),

				// 		favorite: 222,
				// 		comment: 223,
				// 	},
				// 	{
				// 		id: 4,
				// 		author: '赵6',
				// 		title: 'margin和padding的区别',
				// 		imageUrl: require('../../static/news.jpg'),
				// 		favorite: 44,
				// 		comment: 73,
				// 	}
				// ],
				articles: []
			}
		},
		onLoad() {
			this.currentMenus = this.menus.slice(0, 6);
			this.articles = Backend.getHistory().reverse();
		},
		methods: {
			goDetail(id) {
				uni.navigateTo({
					url: "/pages/detail/detail?id=" + id
				})
			},
			check(id) {
				this.n = false
				this.currentId = id
				var currentMenus = this.currentMenus
				// 清空当前菜单

				const first = Math.max(0, Math.min(id - 4, this.menus.length - 6))
				this.currentMenus = this.menus.slice(first, first + 6);

			},

		}
	}
</script>
<style>
	
	.main {
		background-color: #dcdcdc;
		min-height: 100vh;
		border: 1rpx solid #dcdcdc;
	}
	/* 导航开始 */
	.active {
		border-bottom: 4rpx solid black;
		color: black;
		font-weight: bold;
	}

	.nav {
		background-color: #FAFAFA;
		display: flex;
		color: #A5ADB5;
		position: fixed;
		left: 0;
		right: 0;
		top: 60rpx;
	}

	.menu {
		margin: 20rpx 0 10rpx 0;
		padding: 10rpx;
		width: 110rpx;
		text-align: center;
	}



	/* 导航结束 */
	.item {
		width: 100%;
		margin: 20rpx 0rpx;
		background-color: white;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.up1 {
		height: 50rpx;
		width: 250rpx;
		margin-left: 10rpx;
		display: flex;
		gap: 10px;

	}

	.headportrait image {
		border-radius: 50%;
		width: 50rpx;
		height: 50rpx;
	}

	.author {
		font-size: 38rpx;

		white-space: nowrap;
		/* 禁止换行 */
		text-overflow: ellipsis;
		/* 超出部分的文本用省略号表示 */
		overflow-x: hidden;
		/* 超出部分在x方向隐藏 */
	}

	.middle1 {
		display: flex;
		justify-content: space-between;
	}

	.title {
		font-size: 40rpx;
		font-weight: bold;
		white-space: nowrap;
		text-overflow: ellipsis;
		/* 超出部分的文本用省略号表示 */
		overflow-x: hidden;
		/* 超出部分在x方向隐藏 */
	}

	.picture>image {
		width: 150rpx;
		height: 150rpx;

	}

	.down1 {
		display: flex;
		align-items: center;
	}
</style>