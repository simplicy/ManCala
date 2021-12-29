import {signIn} from "next-auth/react"

export default function LoginButton() {
  return (
    <>
      <a onClick={() => signIn("google",{callbackUrl:'http://localhost:3000/'})}><img src="/lightGoogleBtn.png"/></a>
    </>
  )
}