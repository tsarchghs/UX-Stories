
window.onload = async () => {
	var graph = graphql("/");

	const authData = `
		userId,
		token,
		expiresIn
	`
	const adminLoginForm = document.getElementById("adminLoginForm");

	adminLoginForm.onsubmit = async (event) => {
		event.preventDefault();
		try {
			var res = await graph.query.run(`
				query {
					login(
						email:"${document.getElementById("email").value}",
						password:"${document.getElementById("password").value}"
					) {
						${authData}
					}
				}
			`)
			console.log(res);
			Cookies.set('token', res.login.token , { expires: 7 });
			console.log(Cookies.get("token"));
			alert("logged in bro");
		} catch (e) {
			if (e[0] && e[0].message === "Invalid credentials"){
				alert(e[0].message)
			} else {
				throw e;
			}
		}
	}	
}
