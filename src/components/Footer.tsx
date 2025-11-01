import { Trophy, Twitter, Twitch, Youtube, Github } from "lucide-react";

export const Footer = () => {
  const productLinks = [
    { label: "Torneios", href: "#tournaments" },
    { label: "Circuitos", href: "#circuits" },
    { label: "Comunidade", href: "#community" },
    { label: "Pricing", href: "#pricing" },
  ];

  const supportLinks = [
    { label: "Documentação", href: "#docs" },
    { label: "FAQ", href: "#faq" },
    { label: "Contato", href: "#contact" },
    { label: "Status", href: "#status" },
  ];

  const legalLinks = [
    { label: "Termos de Uso", href: "#terms" },
    { label: "Privacidade", href: "#privacy" },
    { label: "Cookies", href: "#cookies" },
  ];

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Twitch, href: "#", label: "Twitch" },
    { icon: Youtube, href: "#", label: "Youtube" },
    { icon: Github, href: "#", label: "Github" },
  ];

  return (
    <footer className="border-t border-border bg-card mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold font-orbitron text-gradient-fire-blue">
                Infinity Tournaments
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Sistema completo para organização e acompanhamento de torneios de jogos online.
              Gerencie competições, circuitos e comunidades com tecnologia de ponta.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="h-9 w-9 rounded-md bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all duration-200 glow-blue-hover"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-orbitron font-bold text-sm mb-4 text-foreground">Produto</h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-orbitron font-bold text-sm mb-4 text-foreground">Suporte</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-orbitron font-bold text-sm mb-4 text-foreground">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Infinity Tournaments. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
