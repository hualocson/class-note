import ThemeToggleButton from "@/components/common/ThemeToggleButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-background/80 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-medium">Class Payment Tracker</h1>
          <ThemeToggleButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
            Track Your Class Payments
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Keep organized with your educational expenses. Simple, efficient, and always accessible.
          </p>
        </section>

        {/* Stats Overview */}
        <section className="mb-12">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-muted-foreground mt-1">Classes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">$0</div>
              <div className="text-xs text-muted-foreground mt-1">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">$0</div>
              <div className="text-xs text-muted-foreground mt-1">This Month</div>
            </div>
          </div>
        </section>

        {/* Main Features */}
        <section className="space-y-6">
          <h3 className="text-lg font-medium">Features</h3>

          <div className="grid gap-4">
            <div className="group p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-sm">📚</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium mb-1">Class Management</h4>
                  <p className="text-sm text-muted-foreground">
                    Add, edit, and organize your classes with instructor details and payment status.
                  </p>
                </div>
              </div>
            </div>

            <div className="group p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-sm">💰</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium mb-1">Payment Tracking</h4>
                  <p className="text-sm text-muted-foreground">
                    Record payments, track due dates, and manage payment history with receipts.
                  </p>
                </div>
              </div>
            </div>

            <div className="group p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-sm">📊</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium mb-1">Analytics & Reports</h4>
                  <p className="text-sm text-muted-foreground">
                    View spending trends, generate reports, and track your educational budget.
                  </p>
                </div>
              </div>
            </div>

            <div className="group p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-sm">📱</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium mb-1">Mobile First</h4>
                  <p className="text-sm text-muted-foreground">
                    Responsive design that works perfectly on all devices, from mobile to desktop.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-12">
          <h3 className="text-lg font-medium mb-4">Quick Start</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm">
              Add Class
            </button>
            <button className="w-full px-4 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors text-sm">
              Record Payment
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
