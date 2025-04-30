export function WelcomeBanner() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="relative overflow-hidden rounded-lg bg-primary p-6 text-primary-foreground">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm">{currentDate}</p>
          <h2 className="text-3xl font-bold">Welcome back, Name!</h2>
          <p className="text-primary-foreground/80">Always stay updated in your student portal</p>
        </div>
        <div className="mt-4 md:mt-0">
          <img
            src="/placeholder.svg?height=150&width=150"
            alt="Student avatar"
            width={150}
            height={150}
            className="h-auto w-auto"
          />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute left-1/4 bottom-0 h-16 w-16 rounded-full bg-white/10 translate-y-1/2" />
      <div className="absolute right-1/3 top-1/3 h-8 w-8 rounded-full bg-white/10" />
    </div>
  )
}
