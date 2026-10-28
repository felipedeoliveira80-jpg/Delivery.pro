import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
interface User { id: string; email: string; firstName: string | null; lastName: string | null; role: "admin" | "staff" }
interface AuthContextType { user: User | null; loading: boolean; login: (email: string, password: string) => Promise<void>; signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>; logout: () => Promise<void> }
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("@delivery-pro:user");
    let active = true;
    let version = 0;
    const sync = async (id?: string) => {
      const current = ++version;
      if (!id) { if (active) { setUser(null); setLoading(false); } return; }
      const { data, error } = await supabase.from("users").select("id,email,first_name,last_name,role").eq("id", id).maybeSingle();
      if (!active || current !== version) return;
      setUser(!error && data?.role === "admin" ? { id: data.id, email: data.email, firstName: data.first_name, lastName: data.last_name, role: "admin" } : null);
      setLoading(false);
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { void sync(session?.user.id); });
    void supabase.auth.getSession().then(({data}) => sync(data.session?.user.id));
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { toast.error("E-mail ou senha inválidos."); return; }
    const { data: profile } = await supabase.from("users").select("role").eq("id", data.user.id).maybeSingle();
    if (profile?.role !== "admin") { await supabase.auth.signOut(); toast.error("Esta conta não tem acesso administrativo."); return; }
    navigate("/dashboard");
  };
  const signup = async () => { toast.error("O cadastro administrativo público está desativado."); };
  const logout = async () => { await supabase.auth.signOut(); setUser(null); navigate("/login"); };
  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("AuthProvider obrigatório"); return value; }
