import { motion } from "framer-motion";
import { Trophy, Zap, Users, BarChart3, Gamepad2, Award, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-tournament.jpg";

export const Home = () => {
  const features = [
    {
      icon: Trophy,
      title: "Torneios",
      description: "Crie e gerencie torneios de qualquer porte com sistema de chaveamento automático",
      gradient: "gradient-fire",
    },
    {
      icon: Zap,
      title: "Circuitos",
      description: "Organize séries de competições conectadas com sistema de pontuação global",
      gradient: "gradient-blue",
    },
    {
      icon: Users,
      title: "Comunidade",
      description: "Conecte jogadores, times e organizadores em uma plataforma unificada",
      gradient: "gradient-fire",
    },
    {
      icon: BarChart3,
      title: "Performance",
      description: "Acompanhe estatísticas detalhadas e rankings em tempo real",
      gradient: "gradient-blue",
    },
  ];

  const stats = [
    { value: "10K+", label: "Jogadores Ativos" },
    { value: "500+", label: "Torneios/Mês" },
    { value: "50+", label: "Jogos Suportados" },
    { value: "$1M+", label: "Em Premiações" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <Gamepad2 className="h-20 w-20 text-primary animate-glow-blue" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-orbitron font-bold mb-6 text-gradient-fire-blue leading-tight">
              Infinity Tournaments
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-rajdhani">
              O sistema mais completo para organização e acompanhamento de torneios de jogos online
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button variant="hero" size="xl" className="animate-glow-fire">
                <Trophy className="mr-2 h-5 w-5" />
                Começar Agora
              </Button>
              <Button variant="neon" size="xl">
                <Target className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 border-glow-blue"
                >
                  <div className="text-3xl md:text-4xl font-orbitron font-bold text-gradient-fire-blue mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-rajdhani">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-primary rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-3 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative" id="tournaments">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 text-gradient-fire-blue">
              Recursos Poderosos
            </h2>
            <p className="text-xl text-muted-foreground font-rajdhani">
              Tudo que você precisa para organizar torneios profissionais
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full bg-card border-glow-blue hover:border-glow-fire transition-all duration-300 group">
                  <div className={`w-12 h-12 rounded-lg ${feature.gradient} flex items-center justify-center mb-4 group-hover:animate-glow-fire`}>
                    <feature.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-xl font-orbitron font-bold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground font-rajdhani">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-12 text-center border-glow-fire"
          >
            <Award className="h-16 w-16 text-primary mx-auto mb-6 animate-glow-blue" />
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4 text-gradient-fire-blue">
              Pronto para Começar?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 font-rajdhani max-w-2xl mx-auto">
              Junte-se a milhares de organizadores que já usam o Infinity Tournaments para
              criar experiências incríveis
            </p>
            <Button variant="hero" size="xl" className="animate-glow-fire">
              <Trophy className="mr-2 h-5 w-5" />
              Criar Conta Grátis
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
