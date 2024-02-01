import UserLoginForm from "../components/auth/UserLoginForm";

export default function Login() {
  return (
    <main className="mt-8">
      <section className="mx-auto max-w-lg p-4">
        <h3 className="font-bold leading-tight text-center text-3xl">
          Welcome back!
        </h3>
        <UserLoginForm />
      </section>
    </main>
  );
}
