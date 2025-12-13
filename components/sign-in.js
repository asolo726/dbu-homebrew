import { signIn } from "../auth";

//Sign In Form Component
export default function SignIn() {
    return (
        <form
            action={async (formData) => {
                "use server";
                await signIn("mailgun", formData);
            }}
        >
            <input type="text" name="email" placeholder="Email" />
            <button type="submit">Signin with Resend</button>
        </form>
    );
}
