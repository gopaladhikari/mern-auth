import { useAppSelector } from "../redux/store";

export default function Dashboard() {
  const { avatar, firstName, email, lastName } = useAppSelector(
    (state) => state.auth
  );
  return (
    <main>
      <h1 className="text-center text-3xl font-bold underline mt-8">Welcome</h1>
      <div className="flex justify-center items-center flex-col mt-8">
        <img src={avatar} alt="avatar" className="w-16 h-16 rounded-full" />
        <p>
          {firstName} {lastName}
        </p>
        <p>{email}</p>
      </div>
    </main>
  );
}
