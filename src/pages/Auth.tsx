import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Erro no login",
            description: error.message || "Credenciais inválidas",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login realizado!",
            description: "Bem-vindo de volta ao Infinity Tournaments",
          });
          navigate("/");
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          toast({
            title: "Erro no cadastro",
            description: error.message || "Não foi possível criar sua conta",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Cadastro realizado!",
            description: "Verifique seu email para confirmar sua conta",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Algo deu errado",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card-neon p-8 rounded-lg">
          <div className="text-center mb-8">
            <h1 className="gradient-text-fire text-3xl font-orbitron font-bold mb-2">
              {isLogin ? "Entrar" : "Cadastrar"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin 
                ? "Entre para acessar sua conta"
                : "Crie sua conta e participe de torneios"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Nome de exibição</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Seu nickname"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={!isLogin}
                  className="input-neon"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-neon"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="input-neon"
              />
            </div>

            <Button
              type="submit"
              variant="neon"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                isLogin ? "Entrar" : "Cadastrar"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin 
                ? "Não tem uma conta? Cadastre-se"
                : "Já tem uma conta? Entre"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
