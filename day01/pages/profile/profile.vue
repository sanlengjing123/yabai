<template>
	<view>
		<!-- 个人资料部分 -->
		<view class="profile">
			<!-- 背景图 -->
			<view class="profile-content">
				<!-- 头像 -->
				<view class="profile-content-right">
					<image class="avatar" :src="author.avatarUrl"></image>
					<view class="profile-buttons">
						<template v-if="!hideFollowButton">
							<view class="follow-button unfollow" v-if="author.followed" @click.stop="unfollow">取消关注
							</view>
							<view class="follow-button following" v-else @click.stop="follow">关注</view>
						</template>
						<template v-if="showMute">
							<view class="follow-button unfollow" v-if="author.muteState>0" @click.stop="mute(author)">
								取消禁言
							</view>
							<view class="follow-button following" v-else @click.stop="mute(author)">禁言</view>
						</template>
					</view>
				</view>
				<view class="user-details">
					<!-- 用户名 -->
					<view class="name-bio">
						<view class="username"> {{author.nickName}} </view>
						<view class="bio">{{author.biography}}</view>
					</view>

				</view>
				<!-- Following 和 Followers -->
				<view class="follow-stats">
					<view class="stat">
						<text class="uid-lable">Uid</text>
						<text class="uid-lable">{{author.id}}</text>
					</view>
					<view class="stat" @tap="goFollowing">
						<text class="label">关注</text>
						<text class="count">{{author.following}}</text>
					</view>
					<view class="stat" @tap="goFollowing">
						<text class="label">粉丝</text>
						<text class="count">{{author.followers}}</text>
					</view>
					<view class="stat">
						<text class="label">帖子</text>
						<text class="count">{{author.posts}}</text>
					</view>
				</view>
				<view class="user-muted" v-if="author.muteState===1">禁言中</view>
			</view>
		</view>

		<!-- 帖子内容部分（可根据需要添加） -->
		<view class="posts">
			<!-- 此处展示帖子列表 -->
			<view class="item" v-for="blog in blogs" :key="blog.id" @tap="goDetail(blog.id)">
				<view class="top">
					<view class="up1">
						<view class="author">
							{{blog.title}}
						</view>
					</view>
					<view class="timess">{{blog.createTime}}</view>
				</view>

				<view class="under-review" v-if="blog.state===1">这个帖子还在审核中</view>
				<view class="under-review" v-if="blog.state===2">这个帖子已被打回</view>
				<view class="middle1">
					<view class="title">
						{{blog.content}}
					</view>
					<view class="picture">
						<!-- <image src="../../static/head.jpg"></image> -->
						<!-- <image v-for="(image, index) in blog.images" :key="index"></image>
						 -->
						<image v-for="(image, index) in blog.images" :key="index"></image>

					</view>

				</view>
				<view class="bottom">
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
	} from '../../backend';
	export default {
		data() {
			return {

				author: {
					avatarUrl: "/static/news.jpg"
				},
				blogs: [],
				userId: '',
				showMute: false,
				hideFollowButton: false



			};
		},
		onLoad(option) {
			this.getAuthor(option.id);
			// console.log(this.author)
			// console.log(this.author)
			this.getBlogs(option.id);
		},
		methods: {
			getAuthor(id) {
				this.hideFollowButton = (id == Backend.getCurrentUser().id);
				var this1 = this;
				Backend.getUser(id, (response) => {
					Backend.userAddMissingData(response.data);
					this1.author = response.data;
					const role = Backend.getCurrentUser().role;
					this1.showMute = role >= 100 && role > this1.author.role;
				});
			},
			follow() {
				Backend.followUser(this.author.id, true);
				this.author.followed = true;
			},
			unfollow() {
				Backend.followUser(this.author.id, false);
				this.author.followed = false;
			},
			getBlogs(authorId) {
				var this1 = this;
				Backend.api({
					url: '/api/blog/search?userId=' + authorId,
					method: 'GET',
					success(response) {
						this1.blogs = response.data;
					}
				});
			},
			mute(author) {
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
			goFollowing() {
				uni.navigateTo({
					url: "/pages/following/following?id=" + this.author.id
				})
			},
			goDetail(id) {
				uni.navigateTo({
					url: "/pages/detail/detail?id=" + id
				})
			}

		},
	}
</script>

<style>
	.profile {
		position: relative;
		background-color: #f5f5f5;
		border: black 1px solid;
	}

	.profile-content {
		/* display: flex; */
		/* align-items: flex-end; */
		padding: 10px;
		position: relative;
		background-image: url('../../static/news.jpg');
	}

	.profile-content-right {
		display: flex;
		justify-content: space-between;
	}

	.profile-buttons {}

	.avatar {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		border: 3px solid white;
	}

	.following {
		background-color: #f5f5f5;
	}

	.unfollow {
		background-color: #a0a0a0;
		color: #e2e2e2;
	}

	.follow-button {
		width: 90px;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 5px;
		margin: 4px;
	}



	.user-details {
		margin-left: 20px;
		color: black;
	}

	.username {
		font-size: 30px;
		font-weight: bold;
	}

	.user-muted {
		display: flex;
		justify-content: space-evenly;
		font-weight: bold;
		background-color: #f0f0f0a0;
	}

	.follow-stats {
		display: flex;
		margin-top: 10px;

	}

	.stat {
		/* margin-right: 20px; */
		width: 60px;
		text-align: center;
	}
	
	.uid-lable{
		font-size: 9px;
	}
	
	.label {
		/* color: rgba(255, 255, 255, 0.7); */
		color: black;
	}

	.count {
		font-size: 18px;
		font-weight: bold;
		text-align: center;
		color: black;
	}

	.posts {
		/* Add your post styles here */
		margin-top: 20px;
	}

	.item {

		width: 90%;
		margin: 15px auto;
		background-color: white;
		padding: 15px;
		box-sizing: border-box;
		border: #a4b5b5 1px solid;
		border-radius: 6px;
	}

	.up1 {
		display: flex;
		width: auto;
		margin-left: 5px;
	}

	.timess {
		color: #A5ADB5;
	}

	.author {
		font-size: 20px;
		font-weight: bold;
		white-space: nowrap;
		/* 禁止换行 */
		text-overflow: ellipsis;
		/* 超出部分的文本用省略号表示 */
		overflow-x: hidden;
		/* 超出部分在x方向隐藏 */
	}

	.under-review {
		display: flex;
		justify-content: space-evenly;
		font-weight: bold;
	}

	.middle1 {
		margin: 5px;
	}

	.title {
		font-size: 20px;
	}

	.picture {
		display: flex;
	}

	.picture image {
		width: 100px;
		height: 100px;
		margin: 5px;
	}


	.bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>