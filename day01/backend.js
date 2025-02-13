export class Backend {
	static getCurrentUser() {
		const user = uni.getStorageSync("login_user");
		return user;
	}
	static setCurrentUser(userdata) {
		if (!userdata.gender) {
			userdata.gender = 0;
		}
		if (!userdata.age) {
			userdata.age = 0;
		}
		if (!userdata.following) {
			userdata.following = 0;
		}
		if (!userdata.followers) {
			userdata.followers = 0;
		}
		if (!userdata.posts) {
			userdata.posts = 0;
		}
		if (!userdata.biography) {
			userdata.biography = "";
		}
		uni.setStorageSync("login_user", userdata);
	}
	static setToken(token) {
		uni.setStorageSync("token", token);
	}
	static getToken() {
		const token = uni.getStorageSync("token");
		return token;
	}

	static noTokenAPI(e) {
		e.url = 'https://api.sadw.top/' + e.url;
		uni.request(e);
	}

	static api(e) {
		if (!e.header) {
			e.header = {};
		}
		e.header.token = Backend.getToken();
		e.url = 'https://api.sadw.top/' + e.url;
		uni.request(e);
	}

	static followUser(userId, follow) {
		Backend.api({
			url: "/api/user/follow",
			method: "POST",
			data: {
				userId: userId,
				follow: follow
			}
		});
	}

	static userAddMissingData(user) {
		if (!user.muteState) {
			user.muteState = 0;
		}
		if (!user.posts) {
			user.posts = 0;
		}
		if (!user.role) {
			user.role = 0;
		}
	}

	static postAddMissingData(value) {
		if (!value.liked)
			value.liked = false;
		if (!value.like)
			value.like = 0;
		if (!value.reply)
			value.reply = 0;
	}

	static addHistory(post) {
		let o = Backend.getHistory();
		// if (o.length < 1 || o[o.length - 1].id != post.id) {
		// 	o.push(post);
		// 	o = o.slice(Math.max(o.length - 20, 0), o.length);
		// 	uni.setStorageSync("history", o);
		// }
		// for (let i = 0; i < o.length; i++) {
		// 	if (o[i].id == post.id) {
		// 		o[i] = post;
		// 	}
		// }
		o = o.filter(a => {
			return a.id != post.id;
		});
		o.push(post);
		o = o.slice(Math.max(o.length - 20, 0), o.length);
		uni.setStorageSync("history", o);
	}

	static getHistory() {
		const o = uni.getStorageSync("history");
		if (!o) {
			return [];
		}
		return o;
	}

	static favoritePost(postId, type, favorite) {
		Backend.api({
			url: "/api/blog/favorite",
			method: 'POST',
			data: {
				postId: postId,
				type: type,
				favorite: favorite
			}
		});
	}

	static getUser(userId, success, fail, complete) {
		Backend.api({
			url: '/api/user/id?id=' + userId,
			method: 'GET',
			success(response) {
				const author = response.data;
				if (!author.following)
					author.following = 0;
				if (!author.followers)
					author.followers = 0;
				if (!author.followed) {
					author.followed = false;
				}
				if (success)
					success(response);
			},
			fail: fail,
			complete: complete
		});
	}

	static modifyCurrentUser(userdata, success, fail, complete) {
		// Backend.setCurrentUser(userdata);
		// Backend._saveProfile(userdata);

		const userdata1 = Backend.getCurrentUser();
		const differences = {};
		Object.keys(userdata).forEach(key => {
			if (!userdata1.hasOwnProperty(key) || userdata[key] !== userdata1[key]) {
				differences[key] = userdata[key];
			}
		});

		Backend.api({
			url: '/api/user/change-profile',
			method: 'POST',
			data: differences,
			success: success,
			fail: fail,
			complete: complete
		});
	}

	static async getBlog(blogId) {

	}

	static async postBlog(blog) {
		const currentUser = Backend.getCurrentUser();

		console.log("post blog 1");
		console.log("startPostBlog");
		const blogs = await this.getBlogs();
		const id = (blogs.length > 0) ? (blogs[blogs.length - 1].id + 1) : 1;
		const myDate = new Date();
		const newBlog = {
			id: id,
			authorId: currentUser.author,
			time: `${myDate.getMonth()+1}-${myDate.getDate()} ${myDate.getHours()}:${myDate.getMinutes()}`,
			icon: currentUser.avatar,
			content: blog.content,
			like: 0,
			reply: 0,
			share: 0,
			liked: false,
			images: [
				"/static/head.jpg",
				"/static/head.jpg",
				"/static/head.jpg"
			]
		};
		blogs.push(newBlog);
		uni.setStorageSync("blogs", blogs);
		console.log("finishPostBlog");
	}

	static getComments(blogId) {
		return {
			blogId: blogId,
			comments: [{
				createTime: "2023"
			}]
		}
	}

	static register(userdata) {
		const name = userdata.name;
		if (Backend._getProfile(name)) {
			console.log("注册失败");
			return false;
		}

		userdata.nickname = userdata.name;
		userdata.avatar = "news.jpg";
		userdata.age = 0;
		userdata.gender = 0;
		const authors = Backend.getAuthors();
		userdata.author = Object.keys(authors).length + 1;
		authors[userdata.author] = {
			name: userdata.nickname,
			avatar: "/static/users/" + userdata.avatar,
			followed: false
		};
		Backend.saveAuthors(authors);

		Backend._saveProfile(userdata);
		console.log(Backend._getProfile(userdata.name));
		return true;
	}

	static login(user) {
		const name = user.name;
		const userdata = Backend._getProfile(name);
		if (!userdata) {
			return "userNotFound";
		}
		if (userdata.password != user.password) {
			console.log(userdata.password);
			console.log(user.password);
			return "passwordError";
		}
		Backend.setCurrentUser(userdata);
		return "success";
	}

	static logout() {
		uni.removeStorageSync("login_user");
		uni.removeStorageSync("token");
		uni.removeStorageSync("history");
		console.log("user logout");
	}

	static mockData() {
		if (uni.getStorageSync("blogs")) {
			return;
		}
		const mockdata = [{
			id: 1,
			authorId: 2,
			time: "8-20 18:00",
			icon: "/static/news.jpg",
			content: "【美图系列】我发布了一篇很水的博文",
			like: 10,
			reply: 1,
			share: 1,
			liked: false,
			images: [
				"/static/head.jpg",
				"/static/head.jpg",
				"/static/head.jpg"
			]
		}, {
			id: 2,
			authorId: 1,
			time: "8-22 17:00",
			icon: "/static/news.jpg",
			content: "【美图系列】我发布了一篇很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的博文",
			like: 10000,
			reply: 4,
			share: 100,
			liked: true,
			images: [
				"/static/head.jpg",
				"/static/head.jpg",
				"/static/head.jpg"
			]
		}, {
			id: 3,
			authorId: 2,
			time: "8-24 18:00",
			icon: "/static/head.jpg",
			content: "【美图系列】我发布了一篇很水的博文",
			like: 1,
			reply: 0,
			share: 0,
			liked: false,
			images: [
				"/static/news.jpg"
			]
		}, {
			id: 4,
			authorId: 1,
			time: "8-24 18:00",
			icon: "/static/head.jpg",
			content: "【美图系列】我发布了一篇图片很多的的博文",
			like: 0,
			reply: 0,
			share: 0,
			liked: false,
			images: [
				"/static/head.jpg",
				"/static/head.jpg",
				"/static/head.jpg",
				"/static/head.jpg",
				"/static/head.jpg",
				"/static/head.jpg"
			]
		}];

		uni.setStorageSync("blogs", mockdata);

		const authors = {};
		authors[1] = {
			name: "带你离开地球",
			avatar: "/static/head.jpg",
			followed: false
		};
		authors[2] = {
			name: "每日放弃uniapp",
			avatar: "/static/news.jpg",
			followed: true
		};
		Backend.saveAuthors(authors);
		// uni.setStorageSync("authors", authors);
	}

	static saveAuthors(authors) {
		uni.setStorageSync("authors", authors);
	}
	static async getAuthorsAsync() {
		Backend.mockData();
		return uni.getStorageSync("authors");
	}
	static getAuthors() {
		Backend.mockData();
		return uni.getStorageSync("authors");
	}

	static async getIndexPageBlogs() {
		Backend.mockData();
		return uni.getStorageSync("blogs");
	}

	static async getBlogs() {
		Backend.mockData();
		return uni.getStorageSync("blogs");
	}

	static _getProfile(username) {
		return uni.getStorageSync("user/" + username);
	}
	static _saveProfile(user) {
		const authors = Backend.getAuthors();
		const author = authors[user.author];
		if (author) {
			author.avatar = "/static/users/" + user.avatar;
			author.name = user.nickname;
			Backend.saveAuthors(authors);
		}
		const name = user.name;
		uni.setStorageSync("user/" + name, user);
	}
}