export default {
  login (email, pass, cb) {
    cb = arguments[arguments.length - 1]
    var token = localStorage.getItem("user_id")
    if (token) {
      if (cb) cb(true)
      this.onChange(true)
      return
    }
  },
  getToken () {
    var token = localStorage.getItem("user_id")
    return token
  },
  logout (cb) {
    localStorage.setItem("user_id", '')
    //drop all database

    if (cb) cb()
    this.onChange(false)
  },
  loggedIn () {
    var token = localStorage.getItem("user_id")
    return !!token
  },
  onChange () {}

}
