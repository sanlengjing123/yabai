<template>
	<view>
		<view class="main">
			<view class="content">
				<view class="title">
					{{ article.title }}
				</view>
				<view class="author_list">
					<view class="author">
						{{ article.author }}
					</view>
					<view class="times">
						{{ article.createTime }}
					</view>
				</view>
				<view class="under-review" v-if="article.state===1">这个帖子还在审核中</view>
				<view class="under-review" v-if="article.state===2">这个帖子已被打回</view>
				<view class="hr"></view>
				<view v-if="loading" class="loading">加载中</view>
				<view v-if="error" class="loading">获取文章错误</view>
				<view class="content_d">
					<rich-text :nodes="article.content"></rich-text>
				</view>
				<view class="s_list">
					<view class="s">
						<view v-if="showDisapprove" @click.stop="approve(article)"
							:class="['t',article.ok?'type':'type_tips']">{{article.ok?'退回审核':'取消退回'}}
						</view>
					</view>
					<view class="g" @tap="likePost(article)">
						<view>收藏：{{article.like}}</view>
						<image src="../../static/heart.svg" v-show="!article.liked"></image>
						<image src="../../static/heart-filled.svg" v-show="article.liked"></image>
					</view>
					<view class="g" @tap="follow">
						<view>关注</view>
						<image src="../../static/follow.png" v-show="!followed"></image>
						<image src="../../static/follow-filled.png" v-show="followed"></image>
					</view>
				</view>
			</view>
			<!-- ... -->
			<view class="comment-banner">
				评论
			</view>

			<view id="comment" class="comment">
				<view v-if="comments.length==0">评论区是空的！</view>
				<block v-for="c in comments" :key='c.id'>
					<view class="author_c">
						<view class="name" @click.stop="gotoAuthor(c)">{{c.author}}</view>
						<!-- 						<view class="stars">
							<template v-for="i in 5">
								<image v-if="i<=c.level" :key="i" src="/static/star-filled.svg"></image>
								<image v-else :key="i" src="/static/star.svg"></image>
							</template>
						</view> -->
						<view v-if="showDisapprove" @click.stop="approve(c)" :class="['t',c.ok?'type':'type_tips']">
							{{c.ok?'退回审核':'取消退回'}}
						</view>
					</view>
					<view class="content_c">
						{{c.content}}
					</view>
					<view class="g" @tap="likePost(c)">
						<view>收藏：{{c.like}}</view>
						<image src="../../static/heart.svg" v-show="!c.liked"></image>
						<image src="../../static/heart-filled.svg" v-show="c.liked"></image>
					</view>
					<view class="times_c">
						评论于{{c.createTime}}
					</view>
					<view class="border">

					</view>
				</block>
			</view>
			<view class="declare">
				<input class="comment-bar" v-model="comment" placeholder="你猜我的评论区在等谁？" />
				<image src="/static/icons8-idea.svg" class="mood" @click="submit"></image>
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
				followed: false,
				id: '',
				article: {
					ok: true
				},
				like: 0,
				// comments: [{
				// 		id: 1,
				// 		author: '李四',
				// 		level: 2,
				// 		content: '这都写的啥啊！',
				// 		createTime: '2023-08-23 16:39:25'
				// 	},
				// 	{
				// 		id: 2,
				// 		author: '王五',
				// 		level: 4,
				// 		content: '这都写的啥啊！',
				// 		createTime: '2023-08-23 16:39:25'
				// 	},
				// 	{
				// 		id: 3,
				// 		author: '赵六',
				// 		level: 5,
				// 		content: '这都写的啥啊！',
				// 		createTime: '2023-08-23 16:39:25'
				// 	}
				// ],
				comments: [],
				showDisapprove: false,
				loading: true,
				error: false,
				comment: ""
			}
		},
		onLoad(option) {
			this.id = option.id
			if (option.hash == "comment") {
				setTimeout(() => {
					uni.pageScrollTo({
						selector: "#comment"
					});
				}, 200);
			}
			this.showDisapprove = Backend.getCurrentUser().role >= 100;
			this.getData();
		},
		methods: {
			submit() {
				const currentUser = Backend.getCurrentUser();
				const timeElapsed = Date.now();
				const today = new Date(timeElapsed);
				this.comments.push({
					content: this.comment,
					author: currentUser.nickName,
					createTime: today.toISOString(),
					level: Math.floor((Math.random() * 5) + 1),
					ok: true
				});

				Backend.api({
					url: '/api/blog/post',
					method: 'POST',
					data: {
						content: this.comment,
						replyPost: this.id
					},
					success(res) {
						if (res.data == "success") {
							uni.showToast({
								title: '发布成功'
							});
						} else {
							uni.showToast({
								title: '发布失败',
								icon: 'error'
							});
						}
					},
					fail(err) {
						uni.showToast({
							title: '服务器错误',
							icon: 'error'
						});
					}
				});
				this.comment = "";
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
			likePost(blog) {
				blog.liked = !blog.liked;
				if (blog.liked) {
					blog.like++;
				} else {
					blog.like--;
				}
				Backend.favoritePost(blog.id, 1, blog.liked);
			},
			follow() {
				this.followed = !this.followed;
				Backend.followUser(this.article.authorId, this.followed);
			},
			gotoAuthor(post) {
				uni.navigateTo({
					url: "/pages/profile/profile?id=" + post.authorId
				});
			},
			getData() {
				var this1 = this;

				Backend.api({
					url: "/api/blog?id=" + this1.id,
					method: "GET",
					success(resp) {
						const article = resp.data[0]
						Backend.postAddMissingData(article);
						article.ok = true;
						this1.article = article;
						this1.liked = article.liked;
						this1.like = article.like;
						if (!this1.like)
							this1.like = 0;
						console.log(resp);
						Backend.getUser(article.authorId, (resp) => {
							this1.followed = resp.data.followed;
						});
						Backend.addHistory(article);
					},
					fail(resp) {
						console.log(resp);
						this1.error = true;
					},
					complete() {
						this1.loading = false;
					}
				});
				Backend.api({
					url: '/api/blog/search?replyPost=' + this1.id,
					// url: '/api/blog/search',
					method: 'GET',
					success(response) {
						const comments = response.data.reverse();
						for (let i = 0; i < comments.length; i++) {
							Backend.postAddMissingData(comments[i]);
							comments[i].ok = true;
						}
						this1.comments = comments;
						// console.log(this1.comment);
					}
				});
			}
		}
	}
</script>

<style>
	.main {
		min-height: 100vh;
		background-color: #dcdcdc;
		border-top: 1rpx solid #dcdcdc;
	}

	.content {
		width: 100%;
		margin: 0px auto;
		background-color: white;
		margin-top: 50rpx;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.title {
		font-size: 40rpx;
		font-weight: bold;
		text-align: center;
	}

	.author_list {
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
	}
	
	.under-review{
		display: flex;
		justify-content: space-evenly;
		font-weight: bold;
	}

	.hr {
		border-bottom: 2rpx solid #dcdcdc;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
	}

	.author_c {
		display: flex;
		justify-content: space-between;
		height: 60rpx;
		line-height: 60rpx;
	}

	.loading {
		font-size: 30rpx;
		font-weight: bold;
		justify-content: center;
	}

	.times_c {
		font-size: 24rpx;
		color: #5555ff;
		text-align: right;
	}

	.content_c {
		line-height: 40rpx;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
	}

	.stars {
		display: flex;
	}

	.stars image {
		width: 32rpx;
		height: 32rpx;
		margin-top: 14rpx;
	}

	.comment {
		background-color: #FFFFFF;
		padding: 10rpx;
		box-sizing: border-box;
		padding-bottom: 40rpx;
	}

	.content_d img {
		max-width: 100%;
	}

	.content_d {
		margin-top: 30rpx;
	}

	.border {
		border: 2rpx solid black;
	}

	.g {
		display: flex;
		margin-left: 20rpx;
		align-items: center;
	}

	.g image {
		width: 40rpx;
		height: 40rpx;
		margin-left: 10rpx;
		margin-top: 10rpx;
	}

	.s {
		flex: 1;
		display: flex;
	}

	.t {
		padding: 2rpx;
		font-size: 20rpx;
		border: 2rpx solid black;
		text-align: center;
		width: 100rpx;
	}

	.type {
		color: black;
	}

	.type_tips {
		color: red;
	}

	.s_list {
		display: flex;
		justify-content: right;
		margin-top: 40rpx;
		height: 60rpx;
		line-height: 60rpx;
	}

	.declare {
		height: 60rpx;
		background-color: #EBEBEC;
		border-radius: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		left: 0;
		right: 0;
		padding: 10rpx;

		overflow-x: hidden;
		position: fixed;
		bottom: 0rpx;
	}

	.comment-bar {
		width: 700rpx;
	}

	.comment-bar ::placeholder {
		color: #A5ADB5;
	}

	.declare image {
		width: 32rpx;
		height: 32rpx;
		margin: 14rpx;
	}
</style>