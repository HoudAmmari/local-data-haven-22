
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database, Shield, Zap, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import PageLayout from '@/components/Layout/PageLayout';

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-scale-in');
            entry.target.classList.remove('opacity-0');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
      
      featureRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);
  
  const features = [
    {
      icon: <Database className="h-8 w-8 mb-4 text-primary" />,
      title: "Local Storage",
      description: "Store your data securely on your own device, without relying on external servers or cloud providers.",
    },
    {
      icon: <Shield className="h-8 w-8 mb-4 text-primary" />,
      title: "Privacy First",
      description: "Keep your data under your control. No data leaves your device unless you explicitly share it.",
    },
    {
      icon: <Zap className="h-8 w-8 mb-4 text-primary" />,
      title: "Fast Access",
      description: "Lightning-fast data operations with minimal latency since everything is stored locally on your device.",
    },
    {
      icon: <Server className="h-8 w-8 mb-4 text-primary" />,
      title: "No Dependencies",
      description: "Works offline and doesn't require an internet connection or external services to function.",
    },
  ];
  
  return (
    <PageLayout fullWidth>
      <div className="w-full">
        {/* Hero Section */}
        <section className="px-4 py-20 sm:py-32 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"
            aria-hidden="true"
          />
          
          <div 
            ref={heroRef}
            className="max-w-5xl mx-auto text-center opacity-0 transition-all duration-700"
          >
            <div className="inline-block mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Your Personal Data Haven
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Store Your Data Locally,<br /> 
              <span className="text-primary">Securely and Privately</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              A beautiful, intuitive interface for storing and managing your data locally on your device — 
              no cloud, no servers, just your computer as the database.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="rounded-full px-8 animate-pulse">
                <Link to="/dashboard">Get Started</Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link to="/files">
                  Browse Files
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="px-4 py-16 bg-card">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Why Choose LocalDataHaven?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Your data should be yours — in every sense of the word.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  ref={(el) => (featureRefs.current[index] = el)}
                  className={cn(
                    "bg-background border rounded-xl p-6 shadow-subtle opacity-0 transition-all duration-500",
                    "hover:shadow-elevated hover:border-primary/20 hover:translate-y-[-4px]",
                    "flex flex-col items-center text-center"
                  )}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="rounded-full bg-primary/10 p-4 mb-2">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="px-4 py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Ready to Take Control of Your Data?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Start storing your files locally and securely with LocalDataHaven.
            </p>
            
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/dashboard">Get Started Now</Link>
            </Button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Index;
