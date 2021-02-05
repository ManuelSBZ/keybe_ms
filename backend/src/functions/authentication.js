const atob = (b64Encoded) => Buffer.from(b64Encoded, 'base64').toString()

const auth_object = (auth, res) => {
    try {
      const pre_result = atob(auth.split(" ")[1]).split(":")
      const result = { "username": pre_result[0], "password": pre_result[1] }
      return result
    } catch (error) {
      console.error(error)
      res.status(401).
        set({ 'WWW.Authentication': 'Basic realm: "login required"' })
        .json({ "auth":false,"message": "missing password or/and username" })
      return null
    }
  }

module.exports = auth_object
