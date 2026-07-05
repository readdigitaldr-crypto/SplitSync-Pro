import { useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { api, apiErrorMessage } from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/ui/Card";
export function LoginPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ email: string; password: string; }>();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();
  return (
    <AuthShell title="Welcome back" subtitle="Sign in with your email to sync trips, balances, and settlements.">
      <form onSubmit={handleSubmit(async (d) => { try { await login(d.email, d.password); toast.success("Welcome back"); nav("/trips"); } catch (e) { toast.error(apiErrorMessage(e)); } })} className="space-y-4">
        <input className="input" placeholder="Email" type="email" {...register("email", { required: true })} />
        <PasswordField show={showPassword} setShow={setShowPassword} placeholder="Password" registration={register("password", { required: true })} />
        <button disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">{isSubmitting ? "Signing in…" : "Sign in"}</button>
        <Link className="block text-center text-sm font-semibold text-indigo-600 dark:text-indigo-300" to="/register">Need an account?</Link>
      </form>
    </AuthShell>
  );
}
export function RegisterPage() {
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm<{ username: string; name: string; email: string; password: string; confirm_password: string; }>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const nav = useNavigate();
  return (
    <AuthShell title="Create account" subtitle="Use username, name, email, and a confirmed password to get started.">
      <form onSubmit={handleSubmit(async (d) => { try { await api.post("/auth/register/", d); toast.success("Account created"); nav("/login"); } catch (e) { toast.error(apiErrorMessage(e)); } })} className="space-y-4">
        <input className="input" placeholder="Username" {...register("username", { required: true })} />
        <input className="input" placeholder="Name" {...register("name", { required: true })} />
        <input className="input" placeholder="Email" type="email" {...register("email", { required: true })} />
        <PasswordField show={showPassword} setShow={setShowPassword} placeholder="Password" registration={register("password", { required: true })} />
        <PasswordField show={showConfirmPassword} setShow={setShowConfirmPassword} placeholder="Confirm password" registration={register("confirm_password", { required: true, validate: (value) => value === watch("password") || "Passwords do not match" })} />
        <button disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">{isSubmitting ? "Creating…" : "Create account"}</button>
        <Link className="block text-center text-sm font-semibold text-indigo-600 dark:text-indigo-300" to="/login">Already registered?</Link>
      </form>
    </AuthShell>
  );
}
function PasswordField({ show, setShow, placeholder, registration }: { show: boolean; setShow: (value: boolean) => void; placeholder: string; registration: UseFormRegisterReturn; }) {
  return <div className="relative"><input className="input pr-12" type={show ? "text" : "password"} placeholder={placeholder} {...registration} /><button type="button" className="absolute inset-y-0 right-3 grid place-items-center text-slate-500 hover:text-indigo-600" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>;
}
function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode; }) {
  return <div className="relative grid min-h-screen place-items-center overflow-hidden p-6"><div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.25),_transparent_30%)]" /><Card className="w-full max-w-md border-white/60 p-8 shadow-2xl"><div className="mb-6 flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-white"><ShieldCheck /></div><div><h1 className="text-3xl font-black">{title}</h1><p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p></div></div>{children}</Card></div>;
}
