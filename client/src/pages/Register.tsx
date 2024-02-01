import UserSignUpForm from "../components/auth/UserSignUpForm";

export default function Register() {
  return (
    <main className="mt-8">
      <section className="mx-auto max-w-lg p-4">
        <h3 className="font-bold leading-tight text-center text-3xl">
          Register
        </h3>
        <UserSignUpForm />
      </section>
    </main>
  );
}
