<template>
	<view class="content">

		<view class="main-view">
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

					<!-- 					<view class="follow" @click.stop="" @click="follow(item)">
							+关注
						<template v-if="item.followed">
							取消关注
						</template>
						<template v-else>
							+关注
						</template>
					</view> -->
				</view>
				<view class="post-text">{{item.title?item.title:item.content}}</view>
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
				<view class="splite-line"></view>
			</view>
		</view>
		<!-- 导航区域 -->
		<view class="nav">
			<view class="search">
				<image :class="logoRot?'logo-rot':'logo'" @click.stop="logoRot=!logoRot" :src="loginUser.icon"></image>
				<view class="input">
					<image src="/static/icons8-search.svg"></image>
					<view class="keyword" @click="gotoSearch">
						搜索帖子、用户
					</view>
				</view>
				<view class="input-1"></view>
			</view>
			<view class="nav-1">
				<view class="menu" v-for="item in currentMenus" :key="item.id" @tap="check(item.id)">
					<view :class="['menu1',item.id==currentId?'active':'']">{{item.name}}</view>
				</view>
				<view class="j" @tap="n=!n">
					<image src="/static/icons8-menu.svg" :class="[n?'up':'down']"></image>
				</view>
			</view>
			<view class="layer" v-show="n">
				<view :class="['layer-item',item.id==currentId?'active_layer':'']" v-for="item in menus" :key="item.id"
					@click.stop="check(item.id)">{{item.name}}
				</view>
			</view>
		</view>
		<view class="share-content">

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
				menus: [{
						id: 1,
						name: '热门'
					},
					{
						id: 2,
						name: '关注'
					},
					{
						id: 3,
						name: '最新'
					}
					// ,
					// {
					// 	id: 4,
					// 	name: '社会'
					// },
					// {
					// 	id: 5,
					// 	name: '科技'
					// },
					// {
					// 	id: 6,
					// 	name: '明星'
					// },
					// {
					// 	id: 7,
					// 	name: '电影'
					// },
					// {
					// 	id: 8,
					// 	name: '音乐'
					// },
					// {
					// 	id: 9,
					// 	name: '数码'
					// },
					// {
					// 	id: 10,
					// 	name: '游戏'
					// }
				],
				currentMenus: [],
				n: false,
				logoRot: false,
				currentId: 1,
				posts: [],
				// posts1: [],
				authors: {},
				loginUser: {
					icon: "/static/icons8-bookmark.svg"
				}
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
				if (userData) {
					this.loginUser.icon = userData.avatarUrl;
				}

				const this1 = this;
				if (this.currentId == 2) {
					Backend.api({
						url: "/api/blog/following-posts",
						success(res) {
							this1.setPosts(res.data);
							this1.posts = res.data;
						}
					});
				} else if (this.currentId == 3) {
					Backend.api({
						url: "/api/blog/latest",
						success(res) {
							this1.setPosts(res.data);
							this1.posts = res.data;
						}
					});
				} else {
					Backend.api({
						url: "/api/blog/index",
						success(res) {
							this1.setPosts(res.data);
							this1.posts = res.data;
						}
					});
				}
			},
			setPosts(values) {
				for (let i = 0; i < values.length; i++) {
					Backend.postAddMissingData(values[i]);

					values[i].liked_activate = false;
				}
				this.posts = values;
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
			gotoSearch() {
				this.clearActiveHeart();
				uni.navigateTo({
					url: "/pages/search/search"
				});
			},
			goLogin() {
				this.clearActiveHeart();
				uni.navigateTo({
					url: "/pages/login/login"
				});
			},
			clearActiveHeart() {
				for (let i = 0; i < this.posts.length; i++) {
					const post = this.posts[i];
					post.liked_activate = false;
				}
			}
		}
	}
</script>

<style>
	.main-view {
		position: absolute;
		top: 158rpx;
		bottom: 0;
		left: 0;
		right: 0;
		overflow-y: scroll;
	}

	.post-content {
		width: auto;
		padding: 20rpx;
		padding-top: 0;
	}

	.splite-line {
		height: 4rpx;
		background: linear-gradient(to right, white, #eee, white);
		margin-top: 20rpx;
	}

	.post-header {
		display: flex;
		justify-content: space-between;
	}

	.post-header-1 {
		display: flex;
	}

	.post-header-2 {
		padding: 8rpx;
	}

	.post-header-3 {
		font-size: 20rpx;
	}

	.post-user-name {
		font-weight: bold;
	}

	.post-text {
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
	}

	.post-bottom view {
		width: 180rpx;
		height: 42rpx;
		display: flex;
		align-items: center;
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

	.layer {
		display: flex;
		flex-wrap: wrap;
		background-color: white;
		padding-bottom: 22rpx;
	}

	.active_layer {
		color: #FF8200;
		font-weight: bold;
	}

	.layer-item {
		align-items: center;
		justify-content: center;
		display: flex;
		width: 160rpx;
		height: 88rpx;
		margin-top: 22rpx;
		margin-left: 22rpx;
		background-color: #EEE;
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

	.menu {
		flex: 1;
		margin: 20rpx 0px;
		display: flex;
		justify-content: center;
	}

	.menu1 {
		text-align: center;
	}

	.j {
		width: 90rpx;
		text-align: center;
	}

	.j image {
		width: 32rpx;
		height: 32rpx;
		margin-top: 25rpx;
	}

	/* 导航结束 */
	/* 搜索开始 */
	.search {
		display: flex;
		background-color: #FAFAFA;
		overflow-x: hidden;
		white-space: nowrap;
		align-items: center;
	}

	.logo {
		width: 70rpx;
		height: 70rpx;
		margin: 0rpx 24rpx;
		border-radius: 50%;
		transform: rotate(0deg);
		transition: 0.3s;
	}

	@keyframes logo-rotate {
		0% {
			transform: rotate(0deg);
		}

		50% {
			transform: rotate(180deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.logo-rot {
		width: 70rpx;
		height: 70rpx;
		margin: 0rpx 24rpx;
		border-radius: 50%;
		/* transform: rotate(180deg); */
		/* transition: 0.3s; */
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
	}

	/* 搜索结束 */
</style>