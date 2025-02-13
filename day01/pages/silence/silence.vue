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
				<image style="avatar" :src="author.avatarUrl"></image>
				<view class="item1">
					<view class="item2">
						<view class="title">
							{{author.nickName}}
						</view>
						<button class="cancel" @click.stop="whole(author)"
							:class="[author.muteState>0?'type':'type_tips']">{{author.muteState>0?'取消禁言':'禁言'}}</button>
					</view>
					<view class="keyword">
						{{(author.biography==""||author.biography==undefined)?"还没有个性签名":author.biography}}
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
				// menus: [{
				// 		id: 1,
				// 		name: '推荐'
				// 	},
				// 	{
				// 		id: 2,
				// 		name: '关注的人'
				// 	},
				// 	{
				// 		id: 3,
				// 		name: '超话'
				// 	},
				// 	{
				// 		id: 4,
				// 		name: '话题'
				// 	},
				// 	{
				// 		id: 5,
				// 		name: '经常访问'
				// 	}
				// ],
				menus: [{
					id: 1,
					name: '禁言用户'
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
				n: false,
				currentId: 1,
				loading: true,
				userId: 0

			}

		},
		onLoad(option) {
			this.currentMenus = this.menus.slice(0, 6);
			this.userId = option.id;
			this.getData();
		},
		methods: {
			goAuthor(id) {
				uni.navigateTo({
					url: "/pages/profile/profile?id=" + id
				});
			},
			check(id) {
				this.n = false;
				this.currentId = id;
				var currentMenus = this.currentMenus;
				// 清空当前菜单

				const first = Math.max(0, Math.min(id - 4, this.menus.length - 6));
				this.currentMenus = this.menus.slice(first, first + 6);

			},
			whole(author) {
				author.muteState = author.muteState == 0 ? 1 : 0;
				Backend.api({
					url: '/api/manager/mute-user',
					method: 'POST',
					data: {
						userId: author.id,
						mute: author.muteState != 0
					},
					success(response) {
						console.log(response.data);
					}
				});
			},
			getData() {
				var this1 = this;
				Backend.api({
					url: "/api/user/search?muted=true",
					success(resp) {
						console.log(resp);
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
		height: 250rpx;
		margin: 30rpx 0rpx;
		background-color: white;
		padding: 30rpx;
		justify-content: space-between;
	}

	.item>image {
		width: 180rpx;
		height: 180rpx;
		margin-top: 10rpx;
		border-radius: 50%;
	}

	.item1 {
		width: auto;
	}

	.item2 {
		position: relative;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.keyword {
		margin-top: 30rpx;
		overflow-y: hidden;
		overflow-x: hidden;
		white-space: break-spaces;
		/* 超出部分在x方向隐藏 */

	}

	.title {
		font-size: 40rpx;
		font-weight: bold;
		white-space: nowrap;
		/* 禁止换行 */
		text-overflow: ellipsis;
		/* 超出部分的文本用省略号表示 */
		overflow-x: hidden;
		/* 超出部分在x方向隐藏 */
		margin-left: 10rpx;
		width: 240rpx;
	}

	.cancel {
		width: 200rpx;
		height: 80rpx;
		display: inline-block;
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

	.main {
		background-color: #dcdcdc;
		min-height: 100vh;
		border: 1rpx solid #dcdcdc;
	}
</style>