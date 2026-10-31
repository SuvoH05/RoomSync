import { useState } from "react";
import { DoorOpen, Mail, LockKeyhole, UserRound, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";

export default function AuthPage({ onLogin, onRegister }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const update = (key, value) => { setForm(old => ({ ...old, [key]: value })); setError(""); };
  const submit = (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim() || (mode === "register" && !form.name.trim())) {
      setError("Please complete all required fields."); return;
    }
    if (form.password.length < 6) { setError("Password must contain at least 6 characters."); return; }
    const result = mode === "login" ? onLogin({ ...form, role }) : onRegister({ ...form, role });
    if (result?.error) setError(result.error);
  };
  const demo = (selectedRole) => onLogin({
    name: selectedRole === "admin" ? "Campus Admin" : "Aarav Sharma",
    email: selectedRole === "admin" ? "admin@roomsync.demo" : "student@roomsync.demo",
    password: "demo123", role: selectedRole
  });
  return (
    <main className="auth-shell">
      <section className="auth-visual">
        <div className="auth-brand"><span className="brand-mark"><DoorOpen size={21}/></span><strong>RoomSync</strong></div>
        <div className="auth-visual-copy">
          <span className="welcome-kicker"><Sparkles size={14}/> YOUR CAMPUS, CONNECTED</span>
          <h1>Find your space.<br/><em>Make it happen.</em></h1>
          <p>Thoughtful spaces make room for great ideas. Discover, reserve and manage campus spaces in one place.</p>
          <div className="auth-feature"><span><ShieldCheck size={17}/></span><div><b>Simple, conflict-aware booking</b><small>Find spaces that fit your time, team and needs.</small></div></div>
        </div>
        <div className="auth-visual-foot">© 2026 RoomSync · Campus space, simplified</div>
        <div className="auth-decoration"><div className="auth-orbit"/><div className="auth-building"><i/><i/><i/><i/><i/><i/></div><span>✦</span></div>
      </section>
      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand"><span className="brand-mark"><DoorOpen size={20}/></span><strong>RoomSync</strong></div>
          <div className="auth-heading"><span className="eyebrow">{mode === "login" ? "WELCOME BACK" : "GET STARTED"}</span><h2>{mode === "login" ? "Sign in to RoomSync" : "Create your account"}</h2><p>{mode === "login" ? "Enter your details to access your workspace." : "Join your campus community and find your space."}</p></div>
          <div className="role-picker" aria-label="Choose account type">
            <button type="button" className={role === "student" ? "chosen" : ""} onClick={() => setRole("student")}><UserRound size={16}/> Student</button>
            <button type="button" className={role === "admin" ? "chosen" : ""} onClick={() => setRole("admin")}><ShieldCheck size={16}/> Administrator</button>
          </div>
          <form className="auth-form" onSubmit={submit}>
            {mode === "register" && <label className="field"><span>Full name</span><div className="auth-input"><UserRound size={17}/><input value={form.name} onChange={e=>update("name",e.target.value)} placeholder="Your full name" autoComplete="name"/></div></label>}
            <label className="field"><span>Email address</span><div className="auth-input"><Mail size={17}/><input type="email" value={form.email} onChange={e=>update("email",e.target.value)} placeholder="you@college.edu" autoComplete="email"/></div></label>
            <label className="field"><span>Password</span><div className="auth-input"><LockKeyhole size={17}/><input type={showPassword ? "text" : "password"} value={form.password} onChange={e=>update("password",e.target.value)} placeholder="At least 6 characters" autoComplete={mode === "login" ? "current-password" : "new-password"}/><button type="button" className="password-toggle" onClick={()=>setShowPassword(v=>!v)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div></label>
            {error && <div className="auth-error" role="alert">{error}</div>}
            <button className="button button-primary auth-submit" type="submit">{mode === "login" ? "Sign in" : "Create account"} <ArrowRight size={17}/></button>
          </form>
          <div className="auth-switch">{mode === "login" ? "New to RoomSync?" : "Already have an account?"} <button onClick={()=>{setMode(mode === "login" ? "register" : "login");setError("");}}>{mode === "login" ? "Create an account" : "Sign in"}</button></div>
          <div className="auth-divider"><span>QUICK DEMO ACCESS</span></div>
          <div className="demo-login-row"><button onClick={()=>demo("student")}>Continue as student <ArrowRight size={14}/></button><button onClick={()=>demo("admin")}>Continue as admin <ArrowRight size={14}/></button></div>
          <p className="auth-disclaimer">Hackathon prototype · Demo accounts use local sample data. Registration is stored in this browser only.</p>
        </div>
      </section>
    </main>
  );
}