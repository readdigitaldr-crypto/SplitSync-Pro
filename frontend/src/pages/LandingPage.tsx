import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
const features = [
  "Smart Expense Splitting",
  "Group Trips",
  "Friend Management",
  "Settlement Tracking",
  "Reports",
  "Charts",
  "Cloud Image Upload",
  "Secure Authentication",
  "Mobile Friendly",
  "Fast Performance",
];
export function LandingPage() {
  return (
    <div className="overflow-hidden">
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-2">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black md:text-7xl"
          >
            SplitSync Pro
          </motion.h1>
          <p className="mt-6 text-xl text-slate-600 dark:text-slate-300">
            Manage group expenses effortlessly. Track spending, split bills
            fairly, and settle balances with friends.
          </p>
          <div className="mt-8 flex gap-4">
            <Link className="btn-primary" to="/register">
              Get Started
            </Link>
            <Link className="btn border" to="/login">
              Login
            </Link>
          </div>
        </div>
        <motion.div
          animate={{ y: [0, -16, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="glass rounded-[2rem] p-8"
        >
          <div className="text-8xl">✈️</div>
          <div className="mt-6 rounded-2xl bg-white p-5 text-slate-900 shadow">
            <b>Goa Trip</b>
            <p>Hotel ₹3000 · split equally</p>
            <p className="text-emerald-600">
              Rahul owes ₹1000 · Aman owes ₹1000
            </p>
          </div>
        </motion.div>
      </section>
      <section id="features" className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-bold">Features</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((f) => (
            <Card key={f}>{f}</Card>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="text-3xl font-bold">How It Works</h2>
        {[
          "Create an account.",
          "Add your friends.",
          "Create a trip.",
          "Invite friends.",
          "Add expenses.",
          "Split expenses.",
          "Settle balances.",
        ].map((s, i) => (
          <div className="mt-4 flex items-center gap-4" key={s}>
            <span className="btn-primary h-10 w-10 rounded-full">{i + 1}</span>
            <Card className="flex-1">{s}</Card>
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-3xl font-bold">Live Demo</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Card>
            Trip
            <br />
            <b>Goa Trip</b>
          </Card>
          <Card>
            Members
            <br />
            Atharva, Rahul, Aman
          </Card>
          <Card>
            Expense
            <br />
            <b>Hotel ₹3000</b>
            <br />
            Paid by Atharva
          </Card>
          <Card>
            Result
            <br />
            Rahul owes ₹1000
            <br />
            Aman owes ₹1000
          </Card>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-bold">Testimonials</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            "Perfect for our treks.",
            "Settlements are finally drama-free.",
            "The reports are beautiful.",
          ].map((t) => (
            <Card key={t}>
              “{t}”<br />
              <b>Happy traveler</b>
            </Card>
          ))}
        </div>
      </section>
      <section id="faq" className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="text-3xl font-bold">FAQ</h2>
        {[
          "How are expenses calculated?",
          "Can I split unequally?",
          "Can I upload receipts?",
          "Can I create multiple trips?",
        ].map((q) => (
          <details className="mt-3 rounded-2xl border p-4" key={q}>
            <summary className="font-semibold">{q}</summary>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Yes. SplitSync Pro validates every split and stores money with
              exact decimal values.
            </p>
          </details>
        ))}
      </section>
      <footer className="border-t p-8 text-center">
        <div className="mb-3 flex justify-center gap-4">
          <a href="#">Home</a>
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
        © SplitSync-Pro. All rights are reserved.
      </footer>
    </div>
  );
}
