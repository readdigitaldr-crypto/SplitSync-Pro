import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ShieldCheck } from "lucide-react";
import { api, apiErrorMessage } from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/ui/Card";
export function LoginPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ username: string; password: string; }>();
  const { login } = useAuth();
  const nav = useNavigate();
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to sync trips, balances, and settlements.">
      <form onSubmit={handleSubmit(async (d) => { try { await login(d.username, d.password); toast.success("Welcome back"); nav("/trips"); } catch (e) { toast.error(apiErrorMessage(e)); } })} className="space-y-4">
        <input className="input" placeholder="Username" {...register("username", { required: true })} />
        <input className="input" type="password" placeholder="Password" {...register("password", { required: true })} />
        <button disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">{isSubmitting ? "Signing in…" : "Login"}</button>
        <Link className="block text-center text-sm font-semibold text-indigo-600 dark:text-indigo-300" to="/register">Need an account?</Link>
      </form>
    </AuthShell>
  );
}
export function RegisterPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ username: string; email: string; full_name: string; password: string; }>();
  const nav = useNavigate();
  return (
    <AuthShell title="Create account" subtitle="Start splitting expenses with production-grade validation.">
      <form onSubmit={handleSubmit(async (d) => { try { await api.post("/auth/register/", d); toast.success("Account created"); nav("/login"); } catch (e) { toast.error(apiErrorMessage(e)); } })} className="space-y-4">
        <input className="input" placeholder="Username" {...register("username", { required: true })} />
        <input className="input" placeholder="Full name" {...register("full_name", { required: true })} />
        <input className="input" placeholder="Email" {...register("email", { required: true })} />
        <input className="input" type="password" placeholder="Password" {...register("password", { required: true })} />
        <button disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">{isSubmitting ? "Creating…" : "Create account"}</button>
        <Link className="block text-center text-sm font-semibold text-indigo-600 dark:text-indigo-300" to="/login">Already registered?</Link>
      </form>
    </AuthShell>
  );
}
function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode; }) {
  return <div className="relative grid min-h-screen place-items-center overflow-hidden p-6"><div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.25),_transparent_30%)]" /><Card className="w-full max-w-md border-white/60 p-8 shadow-2xl"><div className="mb-6 flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-white"><ShieldCheck /></div><div><h1 className="text-3xl font-black">{title}</h1><p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p></div></div>{children}</Card></div>;
}
