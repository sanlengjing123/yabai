<template>
	<view class="search-page">

		<!-- 导航区域 -->
		<view class="nav">
			<view class="search-box">
				<input v-model="searchQuery" placeholder="输入搜索内容" @input="search" />
				<button @tap='search(searchQuery)'>搜索</button>
			</view>
			<view class="nav-1">
				<view class="menu" v-for="item in currentMenus" :key="item.id" @tap="check(item.id)">
					<view :class="['menu1',item.id==currentId?'active':'']">{{item.name}}</view>
				</view>
			</view>
		</view>


		<!-- 展示帖子模块内容 -->
		<view class="main-view" v-if="currentId===1">
			<view v-for="(item,index) in posts" :key="item.id" class="post-content" @click.stop="gotoDetail(item)">
				<view class="post-header">
					<view class="post-header-1">
						<image class="post-user-icon" :src="item.icon" @click.stop="gotoProfile(item)"></image>
						<view class="post-header-2">
							<view class="post-user-name">{{item.author}}</view>
							<view class="post-header-3">{{item.time}}</view>
						</view>
					</view>
					<view class="createTime">{{item.createTime}}</view>
				</view>
				<view class="post-text">{{item.title}}</view>
				<view class="image-list">
					<image v-for="(img,index1) in item.images" :key="index1" :src="img"></image>
				</view>
				<view class="post-bottom">
					<view @click.stop="share(item)">
						<image src="/static/icons8-share.svg"></image>
						{{item.share>0?item.share:'转发'}}
					</view>
					<view @click.stop="reply(item)">
						<image src="/static/icons8-speech-bubble.svg"></image>
						{{item.reply>0?item.reply:'回复'}}
					</view>
					<view @click.stop="like(item)" :class="item.liked?'liked':''">
						<image :src="item.liked?'/static/heart-filled.svg':'/static/heart.svg'"
							:class="item.liked_activate?'liked-heart':''">
						</image>
						{{item.like>0?item.like:'喜欢'}}
					</view>
				</view>
			</view>
		</view>


		<!-- 展示作者模块内容 -->
		<view v-if="currentId===2" class="main-view">
			<view v-if="loading" class="loading">加载中</view>
			<view class="author_item">
				<view class="item" v-for="author in users" :key="author.id" @tap="goAuthor(author.id)">
					<image style="avatar" :src="author.avatarUrl"></image>
					<view class="item1">
						<view class="item2">
							<view class="title">
								{{author.nickName}}
							</view>
							<button class="cancel" v-if="author.id!=selfId" @click.stop="follow(author)"
								:class="[author.followed?'type_tips':'type']">{{author.followed?'取消关注':'关注'}}</button>
						</view>
						<view class="keyword">
							{{(author.biography=="" || author.biography==undefined)?"还没有个性签名":author.biography}}
						</view>
					</view>
				</view>
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
				searchQuery: '',
				menus: [{
						id: 1,
						name: '帖子'
					},
					{
						id: 2,
						name: '用户'
					},
				],
				currentMenus: [],
				n: false,
				logoRot: false,
				currentId: 1,
				posts: [],
				// posts1: [],
				users: [],
				loading: true,
				selfId: 0

			}
		},
		onShow() {
			this.currentMenus = this.menus.slice(0, 6);
			this.refreshPage();
		},
		methods: {
			refreshPage() {
				this.clearActiveHeart();
				const userData = Backend.getCurrentUser();
				this.selfId = userData.id;

				const this1 = this;
				if (this.currentId == 2) {

					Backend.api({
						url: "/api/user/search?name=" + encodeURIComponent(this.searchQuery),
						success(resp) {
							for (let i = 0; i < resp.data.length; i++) {
								const user = resp.data[i];
								if (!user.followed)
									user.followed = false;
							}
							this1.users = resp.data;
						},
						fail(resp) {
							uni.showToast({
								title: '加载失败',
								icon: 'error'
							});
						},
						complete() {
							this1.loading = false;
						}
					});
				} else {
					Backend.api({
						url: "/api/blog/search?title=" + encodeURIComponent(this.searchQuery),
						success(res) {
							this1.postAddMissingData(res.data);
							this1.posts = res.data;
						}
					});
				}
			},
			postAddMissingData(value) {
				for (let i = 0; i < value.length; i++) {
					if (!value[i].liked)
						value[i].liked = false;
					if (!value[i].like)
						value[i].like = 0;
					if (!value[i].reply)
						value[i].reply = 0;

					value[i].liked_activate = false;
				}
			},
			check(id) {
				if (this.currentId != id) {

					this.currentId = id;
					const first = Math.max(0, Math.min(this.menus.length - 6, id - 4));
					let currentMenus = this.menus.slice(first, first + 6);

					this.currentMenus = currentMenus;
					this.refreshPage();
				}
			},
			share(blog) {},
			reply(blog) {
				this.clearActiveHeart();
				uni.navigateTo({
					url: "/pages/detail/detail?id=" + blog.id + "&hash=comment"
				});
			},
			follow(blog) {
				console.log("hello");
				for (let i = 0; i < this.posts.length; i++) {
					if (this.posts[i].authorRef == blog.authorRef) {
						this.posts[i].followed = this.posts[i].authorRef.followed;
					}
				}
				blog.authorRef.followed = !blog.authorRef.followed;
			},
			like(blog) {
				blog.liked = !blog.liked;
				blog.liked_activate = blog.liked;

				if (blog.liked)
					blog.like++;
				else
					blog.like--;

				Backend.favoritePost(blog.id, 1, blog.liked);

				console.log(blog.liked ? "like" : "dislike");
			},
			gotoProfile(blog) {
				this.clearActiveHeart();
				uni.navigateTo({
					url: "/pages/profile/profile?id=" + blog.authorId
				});
			},
			gotoDetail(blog) {
				this.clearActiveHeart();
				uni.navigateTo({
					url: "/pages/detail/detail?id=" + blog.id
				});
			},
			clearActiveHeart() {
				for (let i = 0; i < this.posts.length; i++) {
					const post = this.posts[i];
					post.liked_activate = false;
				}
			},
			goAuthor(id) {
				uni.navigateTo({
					url: "/pages/profile/profile?id=" + id
				});
			},
			follow(author) {
				author.followed = !author.followed;

				Backend.followUser(author.id, author.followed);
			},
			search() {
				this.refreshPage();
			}
		}
	}
</script>

<style>
	.main-view {
		position: absolute;
		top: 150rpx;
		bottom: 0;
		left: 0;
		right: 0;
		overflow-y: scroll;
	}

	.post-content {
		width: auto;
		padding: 20rpx;
		padding-top: 0;
		border: 1px solid #ccc;
		border-radius: 5px;
		margin-bottom: 20px;
		cursor: pointer;
	}

	.post-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	.post-header-1 {
		display: flex;
	}

	.post-header-2 {
		padding: 8rpx;
	}

	.post-header-3 {
		font-size: 20rpx;
		color: #888;
	}

	.post-user-name {
		font-weight: bold;
	}

	.post-text {
		font-size: 18px;
		font-weight: bold;
		margin-top: 16rpx;
		margin-bottom: 16rpx;
	}

	.createTime {
		color: #aaaaaa;
	}

	.follow {
		border: 2rpx solid #aaa;
		color: #aaa;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 14rpx;
		padding: 8rpx;
		width: 130rpx;
		height: 36rpx;
	}


	.post-user-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		cursor: pointer;
	}

	.image-list {
		display: flex;
		flex-wrap: wrap;
		max-width: 800rpx;
	}

	.image-list image {
		width: 220rpx;
		height: 220rpx;
		margin: 4rpx;
	}

	.post-bottom {
		padding: 8rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.post-bottom view {
		width: 180rpx;
		height: 42rpx;
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.post-bottom image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 14rpx;
	}

	@keyframes liked-animation {
		0% {
			transform: scale(1);
		}

		50% {
			transform: scale(1.8);
		}

		100% {
			transform: scale(1);
		}
	}

	.liked {
		color: #ff4444;
	}

	.liked-heart {
		animation-name: liked-animation;
		animation-duration: 0.5s;
		animation-direction: normal;
		animation-iteration-count: 1;
	}


	/* 导航开始 */
	.active {
		border-bottom: 2rpx solid black;
		color: black;
		font-weight: bold;
	}

	.up {
		transform: rotate(180deg);
		transition: all 0.5s;
	}

	.down {
		transform: rotate(0deg);
		transition: all 0.5s;
	}

	.nav {
		top: 0;
		position: absolute;
		right: 0;
		left: 0;
	}

	.nav-1 {
		background-color: #FAFAFA;
		display: flex;
		color: #A5ADB5;
	}

	/* 	@media screen and (max-device-width: 400px) {
		.nav-1 {
			justify-content: baseline;
		}
	} */


	/* 	.menu {
		margin: 20rpx 0px;
		text-align: center;
	} */
	.menu {
		flex: 1;
		margin: 20rpx 0px;
		display: flex;
		justify-content: center;
	}

	.menu1 {
		text-align: center;
	}



	/* 导航结束 */
	/* 搜索开始 */
	.search {
		display: flex;
		background-color: #FAFAFA;
		overflow-x: hidden;
		white-space: nowrap;
	}

	.logo {
		width: 60rpx;
		height: 60rpx;
		margin: 0rpx 30rpx;
		border-radius: 50%;
		transform: rotate(0deg);
		transition: 0.3s;
	}

	.logo-rot {
		width: 60rpx;
		height: 60rpx;
		margin: 0rpx 30rpx;
		border-radius: 50%;
		animation-timing-function: linear;
		animation-duration: 0.5s;
		animation-name: logo-rotate;
		animation-direction: normal;
		animation-iteration-count: infinite;
	}

	.input {
		height: 60rpx;
		width: 570rpx;
		background-color: #EBEBEC;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		overflow-x: hidden;
	}

	.input image {
		width: 32rpx;
		height: 32rpx;
		margin: 14rpx;
		user-select: text;
	}

	.input-1 {
		width: 32rpx;
	}

	.keyword {
		width: 500rpx;
		color: #A5ADB5;
		margin-top: 10rpx;
		overflow-y: hidden;
		overflow-x: hidden;
		white-space: break-spaces;
	}

	.search-box {
		display: flex;
		align-items: center;
	}

	.search-box input {
		flex: 1;
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 10rpx;
		font-size: 30rpx;
	}

	.search-box button {
		font-size: 30rpx;
		width: 70px;
		padding: 0;
		margin: 0;
	}

	/* 新样式 */
	.recommendation {
		border-radius: 5px;
	}

	.recommendation text {
		font-size: 20px;
		font-style: normal;
	}

	.resou {
		display: flex;
		align-items: center;
		margin-top: 10px;
		justify-content: space-between;
		border-radius: 20px;
		background-color: #d4fbff;
		padding: 5%;
	}

	.searchResult {
		margin-top: 10px;
		border: #888 1px solid;
		border-radius: 5px;
		padding: 5%;
	}

	.up1 {
		display: flex;
		justify-content: space-between;
	}

	.up1 button {
		position: absolute;
		right: 50px;
	}

	.middle1 {
		margin: 10rpx;
	}

	.down1 {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.author_item {
		display: flex;
		flex-wrap: wrap;
		/* height: 220rpx; */
		/* margin: 20rpx 0rpx; */
		background-color: white;
		/* padding: 30rpx; */
		justify-content: space-around;
	}

	.author_item>image {
		width: 180rpx;
		height: 180rpx;
		margin-top: 10rpx;
		border-radius: 50%;
	}

	.author_item1 {
		width: auto;
		display: inline-block;
		flex: 1;
	}

	.author_item2 {
		position: relative;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.title {
		font-size: 40rpx;
		font-weight: bold;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow-x: hidden;
		margin-left: 10rpx;
		width: 240rpx;
	}

	.cancel {
		width: 200rpx;
		height: 80rpx;
		display: inline-block;
		padding: 0;
		margin: 0;
	}


	/* 用户部分 */
	/* 	.authors {
		overflow-y: scroll;
		top: 300rpx;
		bottom: 0;
		left: 0;
		right: 0;
		overflow-y: scroll;
	} */

	.loading {
		text-align: center;
		font-weight: bold;
	}

	.item {
		display: flex;
		height: 220rpx;
		margin: 20rpx 0rpx;
		background-color: white;
		padding: 30rpx;
		justify-content: space-around;
	}

	.item>image {
		width: 180rpx;
		height: 180rpx;
		margin-top: 10rpx;
		border-radius: 50%;
	}

	.item1 {
		width: auto;
		display: inline-block;
		flex: 1;
	}

	.item2 {
		position: relative;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.type {
		background-color: #fff;
		color: #7c7c7c;
	}

	.type_tips {
		background: darkgray;
		color: #fff;
	}

	.cancel {
		width: 200rpx;
		height: 80rpx;
		display: inline-block;
		padding: 0;
		margin: 0;
	}

	.keyword {
		width: 460rpx;
		margin-left: 10rpx;

	}
</style>