<template>
	<div class="chat-page">
		<header class="header">
			{{ chatPartner.nickname }}
		</header>
		<main class="chat-area" ref="chatArea">
			<div v-for="(message, index) in messages" :key="index" class="message">
				<div v-if="message.sender === 'partner'" class="partner-message">
					<img :src="chatPartner.avatar" class="avatar">
					<div class="message-content">{{ message.content }}</div>
				</div>
				<div v-else class="my-message">
					<img :src="myAvatar" class="avatar">
					<div class="message-content">{{ message.content }}</div>
					<!-- <img :src="myAvatar" class="avatar"> -->
				</div>
			</div>
		</main>
		<footer class="footer">
			<input v-model="newMessage" class="input-box" placeholder="请输入消息...">
			<button @click="sendMessage" class="send-button">发送</button>
		</footer>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				chatPartner: {
					nickname: "Chat Partner",
					avatar: "chat-partner-avatar.jpg",
				},
				myAvatar: "my-avatar.jpg",
				messages: [{
						sender: "partner",
						content: "Hello! How are you?"
					},
					{
						sender: "me",
						content: "Hi! I'm doing great, thanks!"
					},
					{
						sender: "partner",
						content: "That's awesome to hear!"
					},
					{
						sender: "me",
						content: "Indeed it is!"
					},
					{
						sender: "me",
						content: "Indeed it is!"
					},
					{
						sender: "me",
						content: "Indeed it is!"
					},
					{
						sender: "me",
						content: "Indeed it is!"
					},
					{
						sender: "me",
						content: "Indeed it is!"
					},
					{
						sender: "me",
						content: "Indeed it is!"
					},
					{
						sender: "partner",
						content: "Hello! How are you?"
					},
					{
						sender: "partner",
						content: "Hello! How are you?"
					},
					{
						sender: "partner",
						content: "Hello! How are you?"
					},
				],
				newMessage: "",
			};
		},
		methods: {
			sendMessage() {
				if (this.newMessage.trim() !== "") {
					this.messages.push({
						sender: "me",
						content: this.newMessage
					});
					this.newMessage = "";

					// Scroll to the bottom of the chat area
					this.$refs.chatArea.scrollTop = this.$refs.chatArea.scrollHeight;
				}
			},
		},
	};
</script>

<style scoped>
	.chat-page {
		display: flex;
		flex-direction: column;
	}

	.header {
		text-align: center;
		padding: 10px;
		background-color: #f0f0f0;
		border-bottom: 1px solid #ccc;
	}

	.chat-area {
		flex: 1;
		overflow-y: auto;
		padding: 5px;
		margin-bottom: 50px;
	}

	.message {
		margin-bottom: 10px;
	}

	.partner-message {
		display: flex;
		align-self: flex-start;
		flex-direction: row;
		align-items: center;
	}

	.my-message {
		display: flex;
		align-self: flex-end;
		flex-direction: row-reverse;
		align-items: center;
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin: 0 10px;
	}
	
	.message-content {
		padding: 8px;
		border-radius: 8px;
		background-color: #9aa3f0;
		max-width: 60%;
	}
	
	.partner-message>.message-content{
		background-color: #eff1e9;
	}

	.footer {
		position: fixed;
		bottom: 0;
		display: flex;
		align-items: center;
		width: 100%;
	}

	.input-box {
		flex: 1;
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 5px;
		background-color: #f0f0f0;
	}

	.send-button {
		display: flex;
		align-items: center;
		margin-left: 10px;
		padding: 8px 12px;
		height: 50px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}
</style>