import { LoginClient } from 'app/login/client'

const Login = () => {
  const doLogin = async () => {
    try {
      await LoginClient.getUser(123)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <button onClick={doLogin}>Login</button>
    </div>
  )
}

export { Login }
