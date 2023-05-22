function validation() {

    let userName = document.getElementById('name').value.trim();
    let phone = document.getElementById('phone').value.trim();
    let password = document.getElementById('password').value.trim();
    let confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (userName == '' || phone == '' || password == '' || confirmPassword == '') {
        return false;
    } else if (password !== confirmPassword) {
        return false;
    }else {
        return true;
    }
}