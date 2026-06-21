
"use client";

import { BottomNav } from '@/components/layout/BottomNav';
import { 
  Settings, User, Bell, Shield, 
  HelpCircle, LogOut, ChevronRight, 
  Info, Sparkles, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const menuItems = [
    { icon: User, label: 'Sales Profile', sub: 'James Miller • Spice Specialist' },
    { icon: Bell, label: 'Lead Notifications', sub: 'Push alerts for high-value prospects' },
    { icon: Shield, label: 'Data & Privacy', sub: 'CRM integration & Export settings' },
    { icon: Info, label: 'About SpiceScout', sub: 'Version 2.4.0 (Enterprise)' },
    { icon: HelpCircle, label: 'Support Center', sub: 'User guides & Technical help' },
  ];

  return (
    <div className="pb-32 min-h-screen">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4">
        <div className="flex items-center gap-2">
          <Settings className="text-primary" size={24} />
          <h1 className="font-headline text-2xl font-bold tracking-tight">Settings</h1>
        </div>
      </header>

      <main className="px-4 mt-6">
        <div className="bg-card rounded-3xl border border-border overflow-hidden">
          {menuItems.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{item.label}</h3>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-muted-foreground" />
              </div>
              {idx < menuItems.length - 1 && <Separator className="mx-5 w-auto" />}
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/20">
            <h3 className="font-headline font-bold text-primary flex items-center mb-2">
              <Sparkles size={18} className="mr-2" /> Upgrade to Pro
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Unlock unlimited daily scouts, CRM direct sync, and deep AI market analysis.
            </p>
            <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 font-bold">
              View Plans
            </Button>
          </div>

          <Button variant="outline" className="w-full h-14 rounded-2xl border-destructive text-destructive hover:bg-destructive hover:text-white font-bold transition-all">
            <LogOut size={18} className="mr-2" /> Sign Out
          </Button>

          <div className="text-center pt-8">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
              Designed for Mobile Field Sales Teams
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
