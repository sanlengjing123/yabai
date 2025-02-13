<template>
	<view>
		<!-- 导航区域 -->
		<view class="nav">
			<view :class="['menu',item.id==currentId?'active':'']" v-for="item in currentMenus" :key="item.id"
				@tap="check(item.id)">
				{{item.name}}
			</view>
		</view>
		<view class="main">
			<view v-if="loading" class="loading">加载中</view>
			<view class="item" v-for="author in users" :key="author.id" @tap="goAuthor(author.id)">
				<view class="avatar">
					<image class="avatar" :src="author.avatarUrl"></image>
				</view>
				<view class="item1">
					<view class="item2">
						<view class="title">
							{{author.nickName}}
						</view>
						<button class="cancel" v-if="author.id!=selfId" @click.stop="follow(author)"
							:class="{type:!author.followed,type_tips:author.followed}">{{author.followed?'取消关注':'关注'}}</button>
					</view>
					<view class="keyword">
						{{(author.biography=="" || author.biography==undefined)?"还没有个性签名":author.biography}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		Backend
	} from "../../backend";
	export default {
		data() {
			return {
				menus: [{
					id: 1,
					name: '关注的人'
				}, {
					id: 2,
					name: '粉丝'
				}],
				currentMenus: [],
				// users: [{
				// 		id: 1,
				// 		nickName: '张三',
				// 		followed: true,
				// 		avatarUrl: require('../../static/head.jpg'),
				// 		biography: '颤音博主，分享新鲜事'
				// 	},
				// 	{
				// 		id: 2,
				// 		nickName: '李四',
				// 		followed: true,
				// 		avatarUrl: require('../../static/head.jpg'),
				// 		biography: '今天也不知道干嘛，就希望短学期提前结束的博主'
				// 	},
				// 	{
				// 		id: 3,
				// 		nickName: '王五',
				// 		followed: true,
				// 		avatarUrl: require('../../static/news.jpg'),
				// 		biography: '拒绝加班！！！拒绝加班！！！拒绝加班！！！996来了，007还会远吗？'
				// 	},
				// 	{
				// 		id: 4,
				// 		nickName: '赵6',
				// 		followed: true,
				// 		avatarUrl: require('../../static/news.jpg'),
				// 		biography: '核污水入海，理解叶文洁降临派，成为降临派,世界属于三体wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww'
				// 	}
				// ],
				users: [],
				followers: [],
				n: false,
				currentId: 1,
				loading: true,
				userId: 0,
				selfId: 0,
				currentView: "following"

			}

		},
		onLoad(option) {
			this.currentMenus = this.menus.slice(0, 6);
			this.userId = option.id;
			this.selfId = Backend.getCurrentUser().id;
			this.getData();
		},
		methods: {
			goDetail(id) {
				uni.navigateTo({
					url: "/pages/detail/detail?id=" + id
				});
			},
			goAuthor(id) {
				uni.navigateTo({
					url: "/pages/profile/profile?id=" + id
				});
			},
			check(id) {
				this.n = false;
				if (this.currentId != id) {
					this.currentId = id;
					if (id == 1) {
						this.currentView = "following";
					} else if (id == 2) {
						this.currentView = "followers";
					}
					var currentMenus = this.currentMenus;
					// 清空当前菜单

					const first = Math.max(0, Math.min(id - 4, this.menus.length - 6));
					this.currentMenus = this.menus.slice(first, first + 6);
					this.getData();
				}
			},
			follow(author) {
				author.followed = !author.followed;

				Backend.followUser(author.id, author.followed);
			},
			getData() {
				var this1 = this;
				this1.loading = true;
				this1.users = [];
				Backend.api({
					url: "/api/user/search?" + this.currentView + '=' + this1.userId,
					success(resp) {
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
			}
		}
	}
</script>
<style>
	.main {
		background-color: #dcdcdc;
		min-height: 100vh;
		border: 1rpx solid #dcdcdc;
	}

	.loading {
		text-align: center;
		font-weight: bold;
	}

	.active {
		border-bottom: 2rpx solid black;
		color: black;
		font-weight: bold;
	}

	.nav {
		background-color: #FAFAFA;
		display: flex;
		justify-content: space-evenly;
		color: #A5ADB5;
	}

	.menu {
		margin: 20rpx 0px;
		width: 120rpx;
		text-align: center;
		white-space: nowrap;
		/* 禁止换行 */
	}

	.item {
		display: flex;
		height: 220rpx;
		margin: 20rpx 0rpx;
		background-color: white;
		padding: 30rpx;
		justify-content: space-around;
	}

	.avatar {
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
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.title {
		flex: 1;
		font-size: 40rpx;
		font-weight: bold;
		white-space: nowrap;
		/* 禁止换行 */
		text-overflow: ellipsis;
		/* 超出部分的文本用省略号表示 */
		overflow-x: hidden;
		/* 超出部分在x方向隐藏 */
		margin-left: 10rpx;
		width: 0;
	}

	.keyword {
		margin-top: 10rpx;
		overflow-y: hidden;
		overflow-x: hidden;
		white-space: break-spaces;
	}

	.cancel {
		width: 200rpx;
		height: 80rpx;
		display: inline-block;
		padding: 0;
		margin: 0;
	}

	.type {
		background-color: #fff;
		color: #7c7c7c;
	}

	.type_tips {
		background: darkgray;
		color: #fff;
	}

	.keyword {
		width: 460rpx;
		margin-left: 10rpx;

	}
</style>