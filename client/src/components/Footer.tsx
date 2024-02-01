import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto">
      <p className="text-center pt-4">
        &copy; {new Date().getFullYear()} Developed by{" "}
        <Link
          to="https://github.com/gopaladhikari"
          target="_blank"
          className="underline underline-offset-3"
        >
          gopaladhikari
        </Link>
      </p>
    </footer>
  );
}
