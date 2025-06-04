import Link from "next/link";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <Link
        href="/ticket"
        className="text-blue-600 underline text-xl font-medium"
      >
        Go to Ticket Form
      </Link>
    </main>
  );
}
