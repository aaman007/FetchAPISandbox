$('#getText').on('click', getText);
		$('#getUsers').on('click', getUsers);
		$('#getPosts').on('click', getPosts);
		$('#getContestList').on('click', getContestList);
		$('#addPost').on('submit', addPost)
		$('#contestList').on('submit', userContestList)
		$('#rankList').on('submit', organizationRankList)


		function getText(){
			fetch('info.txt')
			.then((res) => res.text())
			.then((data) => {
				$('#output').html(data);
			})
			.catch((error) => console.log(error))
		}

		function getUsers(){
			fetch('users.json')
			.then((res) => res.json())
			.then((data) => {
				let output = "<h3 class='mb-4'> Users </h3>";
				data.forEach(user => {
					output += `
						<ul class="list-group mb-3">
							<li class="list-group-item" > ID: ${user.id} </li>
							<li class="list-group-item" > Name: ${user.name} </li>
							<li class="list-group-item" > Email: ${user.email} </li>
						</ul>
						`
				});
				$('#output').html(output);
			})
		}

		function getPosts(){
			fetch("https://jsonplaceholder.typicode.com/posts")
			.then((res) => res.json())
			.then((data) => {
				let output = "<h3 class='mb-4'> Posts </h3>";
				data.forEach(post => {
					output += `
						<div class="card card-body mb-2">
							<h3> ${post.title} </h3>
							<p> ${post.body} </p>
						</div>
						`
				})
				$('#output').html(output);
			})
		}

		function addPost(event){
			event.preventDefault();

			fetch("https://jsonplaceholder.typicode.com/posts", {
				method: "POST",
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					title: $('#title').val(),
					body: $('#body').val(),
				}),
			})
			.then((res) => res.json())
			.then((post) => {
				console.log(post)
				let output = "<h3 class='mb-4'> New Post </h3>";
				output += `
					<div class="card card-body mb-2">
						<h3> Title: ${post.title} </h3>
						<p> Body: ${post.body} </p>
						<p> ID: ${post.id} </p>
					</div>
					`
				$('#output').html(output);
				$('#title').val("");
				$('#body').val("");
			})
		}

		function getContestList(){
			fetch("https://codeforces.com/api/user.rating?handle=Decayed")
			.then((res) => res.json())
			.then((data) => {
				data = data["result"];
				let output = "<h3 class='mb-4 text-center'> Decayed's Contest List </h3>";
				output += `
					<table class="table table-striped text-center mb-4">
						<tr>
							<td> # </td>
							<td> Name </td>
							<td> Rank </td>
							<td> Rating Change </td>
							<td> New Rating </td>
						</tr>
					`
				data.reverse();
				let total = data.length
				data.forEach((contest, index) => {
					output += `
						<tr>
							<td> ${total-index} </td>
							<td> ${contest.contestName} </td>
							<td> ${contest.rank}  </td>
							<td> ${contest.newRating - (contest.oldRating > 0 ? contest.oldRating : 1500)}  </td>
							<td> ${contest.newRating}  </td>
						</tr>
						`
				})
				output += "</table>"
				$('#output').html(output);
			})
		}

		function max(a, b){
			return (a > b) ? a : b;
		}
		function min(a, b){
			return (a < b) ? a : b;
		}

		function userContestList(event){
			event.preventDefault()

			let username = $('#username').val();
			let url = "https://codeforces.com/api/user.rating?handle="+username;

			fetch(url)
			.then((res) => res.json())
			.then((data) => {
				data = data["result"];
				let output = `<h3 class='mb-4 text-center'> ${username}'s Contest List </h3>`;
				data.reverse();
				let total = data.length
				let maxRatingIncrease = 0;
				let maxRatingDecrease = 0;
				let bestRank = 1e9;
				let worstRank = 0;
				let currentRating = 0;
				let maxRating = 0;
				let lowestRating = 1e9;
				if(total)
					currentRating = data[0].newRating;

				data.forEach(contest => {
					let ratingChange = contest.newRating - (contest.oldRating > 0 ? contest.oldRating : 1500);
					if(ratingChange > 0)
						maxRatingIncrease = max(maxRatingIncrease, ratingChange);
					else
						maxRatingDecrease = min(maxRatingDecrease, ratingChange);
					bestRank = min(bestRank, contest.rank);
					worstRank = max(worstRank, contest.rank);
					maxRating = max(maxRating, contest.newRating);
					lowestRating = min(lowestRating, contest.newRating);
				})

				output += `
					<div class="card text-center mb-4">
						<div class="card-header"> Contest Summary </div>
						<div class="card-body">
							<strong> Total Contests : ${total} </strong> <br>
							<strong> Current Rating : ${currentRating} </strong> <br>
							<strong> Max Rating : ${maxRating} </strong> <br>
							<strong> Lowest Rating : ${lowestRating} </strong> <br>
							<strong> Best Rank : ${bestRank} </strong> <br>
							<strong> Worst Rank : ${worstRank} </strong> <br>
							<strong> Max Rating Increase : +${maxRatingIncrease} </strong> <br>
							<strong> Max Rating Decrease : ${maxRatingDecrease} </strong> 
						</div>
						<div class="card-footer"></div>
					</div>
					`

				output += `
					<table class="table table-striped text-center mb-4">
						<tr>
							<td> # </td>
							<td> Name </td>
							<td> Rank </td>
							<td> Rating Change </td>
							<td> New Rating </td>
						</tr>
					`
				data.forEach((contest, index) => {
					let ratingChange = contest.newRating - (contest.oldRating > 0 ? contest.oldRating : 1500);
					let sign = (ratingChange >= 0) ? '+' : '';

					output += `
						<tr>
							<td> ${total-index} </td>
							<td> ${contest.contestName} </td>
							<td> ${contest.rank}  </td>
							<td> ${sign + ratingChange}  </td>
							<td> ${contest.newRating}  </td>
						</tr>
						`
				})
				output += "</table>"
				$('#contestListOutput').html(output);
			})
			.catch((error) => {
				console.log(error);
				$('#contestListOutput').html("No Such User Exists!!");
			})
		}

		function organizationRankList(event){
			event.preventDefault()

			let organization = $('#organization').val();
			$('#rankListOutput').html("Not Implemented Yet!!");
		}