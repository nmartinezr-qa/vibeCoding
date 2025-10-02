import Header from "../../components/header";
import Footer from "../../components/footer";

export default function SignupSuccess() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <h1 className="text-2xl font-semibold text-green-600">
          Account created successfully 🎉
        </h1>
        <p className="mt-4 text-sm text-black/70 dark:text-white/70">
          You can now log in with your new account.
        </p>
      </div>
      <Footer />
    </>
  );
}
