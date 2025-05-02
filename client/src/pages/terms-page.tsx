import { MainLayout } from "@/components/layout/main-layout";
import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="container px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Welcome to UniMart. By using our service, you agree to these terms.
          </p>

          <Separator className="my-8" />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. General Terms</h2>
            <p className="text-muted-foreground">
              These terms govern your use of UniMart's marketplace platform.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. User Accounts</h2>
            <p className="text-muted-foreground">
              You are responsible for maintaining the security of your account.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Privacy</h2>
            <p className="text-muted-foreground">
              Your privacy is important to us. Please review our Privacy Policy.
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}