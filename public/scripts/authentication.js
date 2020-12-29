function userLogin(email, password) {
    return $.ajax({
        type: "POST",
        url: '/users/login',
        data: JSON.stringify({email: email, password: password}),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: data => {
            console.log(data)
            document.cookie = "accessToken=" + data.accessToken
            document.cookie = "refreshToken=" + data.refreshToken
        }
    })
}

function userRegister(email, password) {
    return $.ajax({
        type: "POST",
        url: '/users/register',
        data: JSON.stringify({email: email, password: password}),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
    })
}