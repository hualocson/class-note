import ThemeToggleButton from "@/components/common/ThemeToggleButton";

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="bg-background/80 border-border/50 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-medium">Class Payment Tracker</h1>
          <ThemeToggleButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <h2 className="mb-3 text-2xl font-semibold sm:text-3xl">
            Track Your Class Payments
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
            Keep organized with your educational expenses. Simple, efficient,
            and always accessible.
          </p>
        </section>

        {/* Stats Overview */}
        <section className="mb-12">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-muted-foreground mt-1 text-xs">Classes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">$0</div>
              <div className="text-muted-foreground mt-1 text-xs">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">$0</div>
              <div className="text-muted-foreground mt-1 text-xs">
                This Month
              </div>
            </div>
          </div>
        </section>

        {/* Main Features */}
        <section className="space-y-6">
          <h3 className="text-lg font-medium">Features</h3>

          <div className="grid gap-4">
            <div className="group border-border/50 hover:border-border rounded-lg border p-4 transition-colors">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
                  <span className="text-primary text-sm">📚</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="mb-1 font-medium">Class Management</h4>
                  <p className="text-muted-foreground text-sm">
                    Add, edit, and organize your classes with instructor details
                    and payment status.
                  </p>
                </div>
              </div>
            </div>

            <div className="group border-border/50 hover:border-border rounded-lg border p-4 transition-colors">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
                  <span className="text-primary text-sm">💰</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="mb-1 font-medium">Payment Tracking</h4>
                  <p className="text-muted-foreground text-sm">
                    Record payments, track due dates, and manage payment history
                    with receipts.
                  </p>
                </div>
              </div>
            </div>

            <div className="group border-border/50 hover:border-border rounded-lg border p-4 transition-colors">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
                  <span className="text-primary text-sm">📊</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="mb-1 font-medium">Analytics & Reports</h4>
                  <p className="text-muted-foreground text-sm">
                    View spending trends, generate reports, and track your
                    educational budget.
                  </p>
                </div>
              </div>
            </div>

            <div className="group border-border/50 hover:border-border rounded-lg border p-4 transition-colors">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
                  <span className="text-primary text-sm">📱</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="mb-1 font-medium">Mobile First</h4>
                  <p className="text-muted-foreground text-sm">
                    Responsive design that works perfectly on all devices, from
                    mobile to desktop.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-12">
          <h3 className="mb-4 text-lg font-medium">Quick Start</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors">
              Add Class
            </button>
            <button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors">
              Record Payment
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
