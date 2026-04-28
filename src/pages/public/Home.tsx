import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, Users, ArrowRight, ShieldCheck, PlayCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function Home() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-dvh overflow-x-hidden bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 font-display text-lg font-bold text-primary sm:text-2xl">
            <BookOpen className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" aria-hidden />
            <span className="truncate">MedLearn</span>
          </div>

          <div className="hidden items-center gap-2 md:flex md:gap-4">
            <Link to="/courses">
              <span className="cursor-pointer text-sm font-medium text-slate-600 hover:text-primary">
                Catálogo de Cursos
              </span>
            </Link>
            <Link to="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button>Criar Conta</Button>
            </Link>
          </div>

          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 md:hidden"
                aria-label="Abrir menu de navegação"
              >
                <Menu className="h-6 w-6" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[min(100vw-1rem,20rem)] flex-col gap-6">
              <SheetHeader className="text-left">
                <SheetTitle className="font-display">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2">
                <Link to="/courses" onClick={() => setMobileNavOpen(false)}>
                  <span className="block min-h-11 rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 touch-manipulation">
                    Catálogo de Cursos
                  </span>
                </Link>
                <Link to="/login" onClick={() => setMobileNavOpen(false)}>
                  <span className="block min-h-11 rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 touch-manipulation">
                    Entrar
                  </span>
                </Link>
                <Link to="/register" onClick={() => setMobileNavOpen(false)}>
                  <Button className="mt-2 w-full" size="lg">
                    Criar Conta
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 md:pt-20 md:pb-32">
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt=""
            className="h-full w-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-white" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary sm:mb-6">
            <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden /> Plataforma EAD Premium
          </div>
          <h1 className="mx-auto mb-5 max-w-4xl font-display text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
            Excelência em <span className="text-primary">Educação Médica</span> Continuada
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-slate-600 sm:mb-10 sm:text-lg md:text-xl">
            Aprenda com os melhores especialistas. Cursos de alto nível, atualizados e focados na prática clínica para
            estudantes e profissionais de medicina.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="h-12 w-full gap-2 rounded-xl px-6 text-base shadow-xl shadow-primary/20 sm:h-14 sm:px-8 sm:text-lg">
                Começar a Estudar <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
              </Button>
            </Link>
            <Link to="/courses" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="h-12 w-full rounded-xl px-6 text-base sm:h-14 sm:px-8 sm:text-lg">
                Explorar Cursos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-slate-50 py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-16">
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Por que escolher o MedLearn?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:mt-4 sm:text-base">
              Desenvolvido especificamente para as necessidades e o rigor da área médica.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10">
            {[
              {
                icon: PlayCircle,
                title: 'Aulas em Vídeo',
                desc: 'Aulas gravadas em alta qualidade, com demonstrações clínicas e casos reais.',
              },
              {
                icon: Award,
                title: 'Certificação',
                desc: 'Receba certificados válidos para atividades complementares e atualização.',
              },
              {
                icon: Users,
                title: 'Corpo Docente',
                desc: 'Professores que são referências em suas especialidades nos melhores hospitais.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 sm:mb-6">
                  <feature.icon className="h-7 w-7 text-primary" aria-hidden />
                </div>
                <h3 className="mb-2 text-lg font-bold sm:mb-3 sm:text-xl">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 py-10 text-slate-400 sm:py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-display text-lg font-bold text-white sm:text-xl">
            <BookOpen className="h-6 w-6 shrink-0 text-primary" aria-hidden /> MedLearn
          </div>
          <p className="text-center text-xs sm:text-sm">© {new Date().getFullYear()} MedLearn Plataforma EAD. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
