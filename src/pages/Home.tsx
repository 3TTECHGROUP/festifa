const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Festifa
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your premier destination for amazing experiences and exceptional service.
        </p>
        <div className="flex justify-center gap-4 pt-6">
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
            Get Started
          </button>
          <button className="border border-input px-6 py-3 rounded-lg hover:bg-accent transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
