<template>
	<view class="post-edit-area">
		<view class="title-bar">
			<view>
				<image style="width: 68rpx;height: 68rpx;" v-if="this.post.images[0]" :src="this.post.images[0]">
				</image>
			</view>
			<input v-model="post.title" placeholder="请输入标题" />
			<view class="publish-button" @click="publish" :disabled="sendDisabled">发布</view>
		</view>

		<textarea v-model="post.content" placeholder="请输入文本" maxlength="-1">
			</textarea>
		<view v-show="showUploader">

			<!-- 			<uni-file-picker v-model="imageValue" file-extname="jpg" mode="grid" limit="3" title="最多上传3个"
				:imageStyles="imgStyle" @progress="progress" @success="success" @fail="fail" @select="select" /> -->
			<view class="image-list">
				<view class="image2" v-for="(item,index) in imageList" :key="index" @click.stop="selectImage(item)">
					<image :src="item"></image>
				</view>

			</view>
		</view>
		<view class="toggle-uploader" @click="toggleUploader">
			<image src="../../static/icons8-plus.svg"
				:class="['showUploader',showUploader?'button-icon-selected':'button-icon']" />
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
				post: {
					imageUrl: "",
					title: "",
					content: "",
					images: []
				},
				posts: [],
				imageValue: [],
				imgStyle: {
					"height": 60, // 边框高度
					"width": 60, // 边框宽度
					"border": { // 如果为 Boolean 值，可以控制边框显示与否
						"color": "#eee", // 边框颜色
						"width": "1px", // 边框宽度
						"style": "solid", // 边框样式
						"radius": "0%" // 边框圆角，支持百分比
					}
				},
				showUploader: false,
				sendDisabled: false,
				imageList: []
			};
		},
		methods: {
			publish() {
				const this1 = this;
				this1.sendDisabled = true;
				Backend.api({
					url: '/api/blog/post',
					method: 'POST',
					data: this.post,
					success(res) {
						if (res.data == "success") {
							uni.showToast({
								title: '发布成功'
							});
							setTimeout(() => {
								uni.switchTab({
									url: "/pages/index/index"
								});
							}, 1000);
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
					},
					complete() {
						this1.sendDisabled = false;
					}
				});

				// Backend.postBlog(this.post);
				// uni.switchTab({
				// 	url: "/pages/index/index"
				// });
			},

			// 获取上传状态
			select(e) {
				console.log('选择文件：', e)
			},
			// 获取上传进度
			progress(e) {
				console.log('上传进度：', e)
			},

			// 上传成功
			success(e) {
				console.log('上传成功')
			},

			// 上传失败
			fail(e) {
				console.log('上传失败：', e)
			},
			toggleUploader() {
				this.showUploader = !this.showUploader;

				const this1 = this;
				Backend.api({
					url: "/api/fun/random-image-urls",
					success(response) {
						this1.imageList = response.data;
					}
				});
			},
			selectImage(url) {
				this.showUploader = !this.showUploader;
				if (this.post.images.length > 0) {
					this.post.images[0] = url;
				} else {
					this.post.images.push(url);
				}
			}
		}


	};
</script>

<style>
	.title-bar {
		display: flex;
		align-items: center;
	}

	.publish-button {
		right: 0;
		background-color: #3498db;
		color: white;
		white-space: nowrap;
		padding: 10px 20px;
		border-radius: 5px;
		cursor: pointer;
	}

	.post-edit-area {

		margin: 0 auto;
		/* min-height: 93vh; */
		bottom: 0;
		top: 0;
		left: 0;
		right: 0;
		position: absolute;
		/* You can adjust this width as needed */
		/* Take up the entire screen height */
		padding: 0 0px;
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		/* Stretch input elements to full width */
	}

	input {
		width: 100%;
		padding: 10px;
		margin: 0 0;
		/* Center the element within its container */
		/* Add some spacing between elements */
		border: 1px solid #ccc;
		border-radius: 5px;
		box-sizing: content-box;
	}

	textarea {
		display: flex;
		align-items: center;
		width: auto;
		padding: 5px 5px 5px 5px;
		margin: 25px 0px 5px 0px;
		/* Center the element within its container */
		/* margin-bottom: 10px;
		margin-top: 30px; */
		/* Add some spacing between elements */
		border: 1px solid #ccc;
		border-radius: 5px;
		/* box-sizing: content-box; */
	}

	textarea {
		flex: 1;
		/* Take up remaining height in post-edit-area */
		resize: vertical;
		/* Allow vertical resizing for textarea */
	}

	.toggle-uploader {
		position: fixed;
		height: 30px;
		width: 30px;
		bottom: 6px;
		right: 6px;

	}

	.button-icon {
		transform: rotate(0deg);
		transition: 0.5s;
		height: 30px;
		width: 30px;
	}

	.button-icon-selected {
		transform: rotate(180deg);
		transition: 0.5s;
		height: 30px;
		width: 30px;
	}

	.image-list {
		background-color: lightgray;
		height: 250rpx;
		overflow: scroll;
		display: flex;
	}

	.image2 {}

	.image2 image {
		height: 240rpx;
		width: 240rpx;
	}
</style>