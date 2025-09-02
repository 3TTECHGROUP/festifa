const Services = () => {
  const services = [
    {
      title: "Web Development",
      description: "Custom web applications built with modern technologies",
      features: ["React & TypeScript", "Responsive Design", "Performance Optimized"]
    },
    {
      title: "Mobile Apps",
      description: "Native and cross-platform mobile applications",
      features: ["iOS & Android", "React Native", "User-Friendly UI"]
    },
    {
      title: "Consulting",
      description: "Technical consulting and architecture planning",
      features: ["System Design", "Code Review", "Best Practices"]
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Our Services</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Comprehensive solutions tailored to your needs
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={index} className="border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold">{service.title}</h3>
            <p className="text-muted-foreground">{service.description}</p>
            <ul className="space-y-2">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Services
