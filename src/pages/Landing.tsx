import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Zap, Shield, BarChart3, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SignupPopup from '@/components/SignupPopup';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            PF
          </div>
          <span className="text-xl font-bold tracking-tight">Project Flow</span>
        </div>
        <div>
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mr-2">
            Entrar
          </Button>
          <Button onClick={() => navigate('/dashboard')}>Começar Agora</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col justify-center items-center text-center px-4 py-20 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 mb-6 gap-2">
          <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
          Lançamento Oficial
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto mb-6 leading-tight">
          O controle total dos seus projetos nunca foi tão <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">acessível</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Gerencie tarefas, equipes e prazos em uma plataforma moderna e intuitiva. Pare de perder o controle.
        </p>

        {/* Pricing Highlight Card */}
        <div className="relative group mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-card border border-border rounded-2xl p-8 shadow-2xl max-w-md mx-auto transform transition-all hover:scale-[1.02]">
            <div className="absolute -top-4 -right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12">
              TEMPO LIMITADO
            </div>
            <h3 className="text-2xl font-bold mb-2">Plano de Inauguração</h3>
            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="text-4xl font-extrabold text-primary">R$ 29,90</span>
              <span className="text-sm font-medium text-muted-foreground">/mês</span>
            </div>
            <ul className="text-left space-y-3 mb-8">
              {[
                "Projetos e tarefas ilimitados",
                "Gestão de equipe e permissões",
                "Avisos de risco e inteligência de dados",
                "Dashboard completo e relatórios",
                "Suporte prioritário"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm md:text-base text-card-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" className="w-full text-lg h-14" onClick={() => window.open('https://buy.stripe.com/8x25kw1Zt7mq8xX4b5gjC01', '_blank')}>
              Garantir Minha Vaga <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Apenas para os primeiros 100 usuários. Cancele quando quiser.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-24 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Por que escolher o Project Flow?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Tudo que você precisa para levar a produtividade da sua equipe para o próximo nível.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Velocidade Extrema",
              desc: "Navegação fluida e respostas instantâneas, sem carregamentos infinitos.",
              icon: Zap,
              color: "text-yellow-500"
            },
            {
              title: "Controle Total",
              desc: "Gere relatórios, monitore riscos e tome decisões baseadas em dados concretos.",
              icon: BarChart3,
              color: "text-blue-500"
            },
            {
              title: "Segurança de Dados",
              desc: "Seus projetos e informações confidenciais seguros com criptografia de ponta.",
              icon: Shield,
              color: "text-emerald-500"
            }
          ].map((feature, i) => (
            <div key={i} className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl hover:bg-card transition-colors">
              <div className={`w-12 h-12 rounded-xl bg-card border flex items-center justify-center mb-6 shadow-sm`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-4 py-24 text-center relative overflow-hidden rounded-3xl mb-12">
        <div className="absolute inset-0 bg-primary/5 pattern-dots pointer-events-none" />
        <div className="relative z-10">
          <Rocket className="w-16 h-16 mx-auto mb-6 text-primary" />
          <h2 className="text-4xl font-bold mb-6">Pronto para transformar sua gestão?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Aproveite a oferta de inauguração e junte-se aos primeiros usuários do sistema.
          </p>
          <Button size="lg" className="h-14 px-8 text-lg" onClick={() => window.open('https://buy.stripe.com/8x25kw1Zt7mq8xX4b5gjC01', '_blank')}>
            Criar Conta Agora - R$ 29,90/mês
          </Button>
        </div>
      </section>

      {/* Footer mini */}
      <footer className="border-t py-8 text-center text-muted-foreground text-sm">
        <p>© 2026 Project Flow. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Landing;
